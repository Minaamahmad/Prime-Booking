import Room from "../Models/Rooms.js";
import Hotel from "../Models/Hotels.js";

// Create a new room for a specific hotel by matching hotel id and owner id
export const createRoom = async (req, res) => {
  try {
    const { type, price_per_night, total_stock } = req.body;
    const hotel_id = req.params.id;
    const user_id = req.user._id;

    // Convert to numbers
    const price = parseFloat(price_per_night);
    const stock = parseInt(total_stock);

    // Validate inputs
    if (!type || !price_per_night || !total_stock) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({ message: "Invalid stock" });
    }

    // verification of owner
    const hotel = await Hotel.findById(hotel_id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    if (hotel.owner_id.toString() !== user_id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // new room
    const newRoom = new Room({
      hotel_id,
      type,
      price_per_night: price,
      total_stock: stock,
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: "Failed to create Room", error: error.message });
  }
};

// Get all rooms for a hotel
export const getRoomsByHotel = async (req, res) => {
  try {
    const hotel_id = req.params.id;
    const user_id = req.user._id;

    // Verify hotel exists and user owns it
    const hotel = await Hotel.findById(hotel_id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    if (hotel.owner_id.toString() !== user_id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const rooms = await Room.find({ hotel_id }).populate("hotel_id");
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve Rooms", error });
  }
};

// Get a single room by ID
export const getRoom = async (req, res) => {
  try {
    const room_id = req.params.roomId;
    const user_id = req.user._id;

    const room = await Room.findById(room_id).populate("hotel_id");
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Verify user owns the hotel
    const hotel = await Hotel.findById(room.hotel_id._id);
    if (hotel.owner_id.toString() !== user_id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve Room", error });
  }
};

// Update a room
export const updateRoom = async (req, res) => {
  try {
    const room_id = req.params.roomId;
    const user_id = req.user._id;
    const { type, price_per_night, total_stock } = req.body;

    const room = await Room.findById(room_id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Verify user owns the hotel
    const hotel = await Hotel.findById(room.hotel_id);
    if (hotel.owner_id.toString() !== user_id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Validate and convert inputs if provided
    if (price_per_night !== undefined) {
      const price = parseFloat(price_per_night);
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ message: "Invalid price" });
      }
      room.price_per_night = price;
    }

    if (total_stock !== undefined) {
      const stock = parseInt(total_stock);
      if (isNaN(stock) || stock < 0) {
        return res.status(400).json({ message: "Invalid stock" });
      }
      room.total_stock = stock;
    }

    if (type !== undefined) {
      room.type = type;
    }

    await room.save();
    res.status(200).json(room);
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ message: "Failed to update Room", error: error.message });
  }
};

// Delete a room
export const deleteRoom = async (req, res) => {
  try {
    const room_id = req.params.roomId;
    const user_id = req.user._id;

    const room = await Room.findById(room_id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Verify user owns the hotel
    const hotel = await Hotel.findById(room.hotel_id);
    if (hotel.owner_id.toString() !== user_id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await room.deleteOne();
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete Room", error });
  }
};

// Upload room images
export const uploadRoomImages = async (req, res) => {
  try {
    const room_id = req.params.roomId;
    const user_id = req.user._id;

    const room = await Room.findById(room_id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Verify user owns the hotel
    const hotel = await Hotel.findById(room.hotel_id);
    if (hotel.owner_id.toString() !== user_id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Validate files
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    for (const file of req.files) {
      if (file.size > maxFileSize) {
        return res.status(400).json({ 
          message: `File ${file.originalname} is too large. Maximum size is 5MB` 
        });
      }
    }

    const imagePaths = req.files.map((file) => `/uploads/rooms/${file.filename}`);
    room.images = [...room.images, ...imagePaths];
    await room.save();
    res.status(200).json({
      message: "Images uploaded successfully",
      images: room.images,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload images", error });
  }
};