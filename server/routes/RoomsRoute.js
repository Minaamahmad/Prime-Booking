import {
  createRoom,
  getRoomsByHotel,
  getAvailableRoomsByHotel,
  getRoom,
  updateRoom,
  deleteRoom,
  uploadRoomImages,
} from "../Controllers/RoomsController.js";
import express from "express";
import protect, { authorizeRoles } from "../Middlewares/auth.js";
import { handleUploadError, validateImageUpload } from "../middleware/uploadErrorHandler.js";

const router = express.Router();

// Middleware to attach multer to router
router.use((req, res, next) => {
  req.roomUpload = req.app.uploadRoom;
  next();
});

// Create a new room for a hotel
router.post("/:id", protect, authorizeRoles("Owner"), createRoom);

// Get available rooms for a specific hotel (public - for guests) - Must come BEFORE /:id
router.get("/available/:id", getAvailableRoomsByHotel);

// Get all rooms for a specific hotel (owner only)
router.get("/:id", protect, authorizeRoles("Owner"), getRoomsByHotel);

// Get a single room by ID
router.get("/:id/:roomId", protect, authorizeRoles("Owner"), getRoom);

// Update a room
router.put("/:id/:roomId", protect, authorizeRoles("Owner"), updateRoom);

// Delete a room
router.delete("/:id/:roomId", protect, authorizeRoles("Owner"), deleteRoom);

// Upload room images
router.post("/:id/:roomId/upload-images", protect, authorizeRoles("Owner"), (req, res, next) => {
  req.roomUpload.array("images", 10)(req, res, next);
}, handleUploadError, validateImageUpload, uploadRoomImages);

export default router;
