import express from "express";
import protect from "../Middlewares/auth.js";
import {
  getMessagesByBooking,
  sendMessage,
} from "../Controllers/MessagesController.js";

const router = express.Router();

router.get('/booking/:bookingId', protect, getMessagesByBooking);
router.post('/booking/:bookingId', protect, sendMessage);

export default router;
