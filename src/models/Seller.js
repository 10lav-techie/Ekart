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
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true, // [longitude, latitude]
      },
    },
    monthlyVisits: {
      type: Number,
      default: 0,
    },
    lastVisitReset: {
      type: Date,
      default: Date.now,
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
sellerSchema.index({ location: "2dsphere" });


const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
