import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import http from "http";
import { Server } from "socket.io";
import hotelrouter from "./routes/HotelsRoute.js";
import roomrouter from "./routes/RoomsRoute.js";
import bookingrouter from "./routes/BookingRoute.js";
import messagesrouter from "./routes/MessagesRoute.js";
import "./config/passport.js";
import cookieParser from "cookie-parser";
import googlAuthrouter from "./Controllers/googleauth.js";

const app = express();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const uploadsDir = path.join(__dirname, "uploads");
const hotelsDir = path.join(uploadsDir, "hotels");
const roomsDir = path.join(uploadsDir, "rooms");

if (!fs.existsSync(hotelsDir)) {
  fs.mkdirSync(hotelsDir, { recursive: true });
}
if (!fs.existsSync(roomsDir)) {
  fs.mkdirSync(roomsDir, { recursive: true });
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const hotelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, hotelsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const hotelUpload = multer({
  storage: hotelStorage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

const roomStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, roomsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const roomUpload = multer({
  storage: roomStorage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

app.uploadHotel = hotelUpload;
app.uploadRoom = roomUpload;

const URI = process.env.MONGO_URI;
mongoose
  .connect(URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

app.set('io', io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join_room", ({ bookingId }) => {
    if (bookingId) {
      socket.join(bookingId);
      console.log(`Socket ${socket.id} joined room ${bookingId}`);
    }
  });

  socket.on("leave_room", ({ bookingId }) => {
    if (bookingId) {
      socket.leave(bookingId);
      console.log(`Socket ${socket.id} left room ${bookingId}`);
    }
  });
});

app.use("/auth", googlAuthrouter);
app.use("/v1/hotels", hotelrouter);
app.use("/v1/rooms", roomrouter);
app.use("/v1/bookings", bookingrouter);
app.use("/v1/messages", messagesrouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});