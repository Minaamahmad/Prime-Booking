import cors from 'cors';
import express from "express";
import 'dotenv/config'; 
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
import { cloudinary } from "./config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

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
const URI = process.env.MONGODB_URI;
mongoose
  .connect(URI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

// Cloudinary multer storage configuration
const hotelStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hotels',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  }
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

const roomStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'rooms',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  }
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

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

app.set('io', io);

io.on("connection", (socket) => {

  socket.on("join_room", ({ bookingId }) => {
    if (bookingId) {
      socket.join(bookingId);
    }
  });

  socket.on("leave_room", ({ bookingId }) => {
    if (bookingId) {
      socket.leave(bookingId);
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
  console.log(`Server is running on port`);
});