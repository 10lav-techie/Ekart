// Seller mongoose schema
import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: { type: String },
    bannerImage: { type: String },
    logoImage: { type: String },

    address: {
        type: String,
        required: true,
        trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },

  },
  { timestamps: true }
);


const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
