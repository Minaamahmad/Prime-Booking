import Hotels from "../Models/Hotels.js";


// Create a new hotel
export const createHotel = async (req, res) => {
  try {
    const { name, description, location } = req.body;
    const owner_id = req.user._id;

    // Validation
    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required" });
    }

    const newHotel = new Hotels({
      owner_id,
      name,
      description,
      location,
      images: [],
    });

    await newHotel.save();
    res.status(201).json(newHotel);
  } catch (error) {
    res.status(500).json({ message: "Failed to create hotel", error });
  }
};

// Get owner  hotels
export const getHotels = async (req, res) => {
  try {
    const owner_id = req.user._id;
    const hotels = await Hotels.find({owner_id}).populate("owner_id", "name email");
    res.status(200).json(hotels);
  }
    catch (error) {
    res.status(500).json({ message: "Failed to retrieve hotels", error });
  } 
};

export const publicHotels = async (req, res) => {
  try {
    const hotels = await Hotels.find()
    res.status(200).json(hotels);
  }
    catch (error) {
    res.status(500).json({ message: "Failed to retrieve hotels", error });
  } 
};

// Get popular hotels
export const getPopularHotels = async (req, res) => {
  try {
    const hotels = await Hotels.find().sort({ popularity: -1 }).limit(10);
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve popular hotels", error });
  }
};

// Get a single hotel by ID
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotels.findById(req.params.id).populate("owner_id", "name email");
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    // Increment popularity on view
    await Hotels.findByIdAndUpdate(req.params.id, { $inc: { popularity: 1 } });
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve hotel", error });
  }
};

// Update a hotel by ID
export const updateHotel = async (req, res) => {
  try {
    const { name, description, location } = req.body;
    const hotel = await Hotels.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    if (hotel.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    hotel.name = name || hotel.name;
    hotel.description = description || hotel.description;
    hotel.location = location || hotel.location;
    await hotel.save();
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Failed to update hotel", error });
  }
};

// Delete a hotel by ID
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotels.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    if (hotel.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await hotel.deleteOne();
    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete hotel", error });
  }
};

// Upload hotel images
export const uploadHotelImages = async (req, res) => {
  try {
    const hotel = await Hotels.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    if (hotel.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Extract Cloudinary URLs from uploaded files
    const imageUrls = req.files.map((file) => file.path);
    hotel.images = [...hotel.images, ...imageUrls];
    await hotel.save();
    
    res.status(200).json({
      message: "Images uploaded successfully",
      images: hotel.images,
    });
  } catch (error) {
    console.error('Hotel image upload error:', error);
    res.status(500).json({ 
      message: "Failed to upload images", 
      error: error.message 
    });
  }
};