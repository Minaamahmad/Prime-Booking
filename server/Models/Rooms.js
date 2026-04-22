
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    type: {
      type: String,
      enum: ["Single", "Double"],
      required: true,
    },

    price_per_night: {
      type: Number,
      required: true,
      min: 0,
    },

    total_stock: {
      type: Number,
      required: true,
      min: 0,
    },

    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
