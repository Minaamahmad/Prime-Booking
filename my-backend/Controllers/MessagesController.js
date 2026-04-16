import Message from "../Models/Messages.js";
import Booking from "../Models/Bookings.js";
import Hotel from "../Models/Hotels.js";

export const getMessagesByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate('hotel_id');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isGuest = booking.user_id.toString() === req.user._id.toString();
    const isOwner = booking.hotel_id.owner_id.toString() === req.user._id.toString();
    if (!isGuest && !isOwner) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const messages = await Message.find({ booking_id: bookingId })
      .sort('createdAt')
      .populate('sender_id', 'name email')
      .populate('receiver_id', 'name email');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages', error });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const booking = await Booking.findById(bookingId).populate('hotel_id');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isGuest = booking.user_id.toString() === req.user._id.toString();
    const isOwner = booking.hotel_id.owner_id.toString() === req.user._id.toString();
    if (!isGuest && !isOwner) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const receiverId = isGuest ? booking.hotel_id.owner_id : booking.user_id;

    const message = new Message({
      sender_id: req.user._id,
      receiver_id: receiverId,
      hotel_id: booking.hotel_id._id,
      booking_id: booking._id,
      content,
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender_id', 'name email')
      .populate('receiver_id', 'name email');

    if (req.app.get('io')) {
      req.app.get('io').to(bookingId).emit('new_message', populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error });
  }
};
