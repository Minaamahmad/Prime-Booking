import Rooms from "../Models/Rooms.js";
import Bookings from "../Models/Bookings.js";
import Hotels from "../Models/Hotels.js";

export const createBooking = async (req, res) => {
  try {
    const { room_id, check_in, check_out } = req.body;
    const user_id = req.user._id;

    // Validate dates
    if (!check_in || !check_out) {
      return res.status(400).json({ message: "Check-in and check-out dates are required" });
    }

    const room = await Rooms.findById(room_id).populate("hotel_id");
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if room has availability
    if (room.total_stock <= 0) {
      return res.status(400).json({ message: "Room is not available" });
    }

    const nights = Math.ceil(
      (new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24)
    );
    if (nights <= 0) {
      return res.status(400).json({ message: "Invalid dates" });
    }

    // Calculate total price
    const total_price = nights * room.price_per_night;

    const newBooking = new Bookings({
      user_id,
      room_id,
      hotel_id: room.hotel_id,
      check_in,
      check_out,
      total_price,
      status: "Pending",
    });

    await newBooking.save();

    // Decrease room stock
    room.total_stock -= 1;
    await room.save();

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: "Booking error", error });
  }
}

export const getBookingsByUser = async (req, res) => {
  try {
    const user_id = req.user._id;
    const bookings = await Bookings.find({ user_id })
      .populate("room_id")
      .populate("hotel_id");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve bookings", error });
  }
};

export const getBookingsByHotel = async (req, res) => {
  try {
    const hotel_id = req.params.hotelId;
    const hotel = await Hotels.findById(hotel_id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    if (hotel.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const bookings = await Bookings.find({ hotel_id })
      .populate('room_id')
      .populate('user_id', 'name email');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve bookings', error });
  }
};

export const getBookingsByOwner = async (req, res) => {
  try {
    const hotels = await Hotels.find({ owner_id: req.user._id }).select('_id');
    const hotelIds = hotels.map((hotel) => hotel._id);

    const bookings = await Bookings.find({ hotel_id: { $in: hotelIds } })
      .populate('room_id')
      .populate('user_id', 'name email')
      .populate('hotel_id', 'name location');

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve owner bookings', error });
  }
};

export const approveBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Bookings.findById(id).populate('hotel_id');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found!' });
    }
    if (booking.hotel_id.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    booking.status = 'Confirmed';
    await booking.save();

    res.status(200).json({
      message: `Booking #${id} has been confirmed.`,
      updatedBooking: booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const cancelBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Bookings.findById(id).populate('hotel_id');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found!' });
    }

    if (
      booking.user_id.toString() !== req.user._id.toString() &&
      booking.hotel_id.owner_id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (booking.status === 'Pending' || booking.status === 'Confirmed') {
      const room = await Rooms.findById(booking.room_id);
      if (room) {
        room.total_stock += 1;
        await room.save();
      }
    }

    await Bookings.findByIdAndDelete(id);

    res.status(200).json({
      message: `Booking #${id} has been cancelled and room stock restored.`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
