import {
  createBooking,
  getBookingsByUser,
  getBookingsByHotel,
  getBookingsByOwner,
  approveBooking,
  cancelBooking,
} from "../Controllers/BookingController.js";
import express from "express";
import protect, { authorizeRoles } from "../Middlewares/auth.js";

const router = express.Router();


router.post('/', protect, authorizeRoles('Guest'), createBooking);

router.get('/', protect, authorizeRoles('Guest'), getBookingsByUser);

router.get('/hotel/:hotelId', protect, authorizeRoles('Owner'), getBookingsByHotel);

router.get('/owner', protect, authorizeRoles('Owner'), getBookingsByOwner);

router.put('/:id/approve', protect, authorizeRoles('Owner'), approveBooking);

router.delete('/:id', protect, cancelBooking);

export default router;
