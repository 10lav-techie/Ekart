import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ================= BASIC INFO =================
    name: {
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

    // ================= ROLE =================
    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },

    // ================= SELLER LINK =================
    sellerId: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Seller",

      default: null,
    },

    // ================= PROFILE =================
    avatar: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    // ================= PASSWORD RESET =================
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model(
  "User",
  userSchema
);

export default User;