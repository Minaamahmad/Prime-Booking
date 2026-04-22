// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    role: {
      type: String,
      enum: ["Guest", "Owner", "Admin", null],
      default: null,
    },

    provider: {
      type: String,
      enum: ["google", "facebook",],
      required: true,
    },

    provider_id: {
      type: String,
      required: true,
      unique: true,
    },

    avatar: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
