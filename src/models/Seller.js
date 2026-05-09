
import mongoose from "mongoose";

const sellerSchema =
  new mongoose.Schema(
    {
      // =====================================================
      // OWNER INFO
      // =====================================================
      ownerName: {
        type: String,

        required: true,

        trim: true,
      },

      // =====================================================
      // LINKED USER (OPTIONAL)
      // =====================================================
      userId: {
        type:
          mongoose.Schema
            .Types.ObjectId,

        ref: "User",

        required: false,

        default: null,
      },

      // =====================================================
      // SHOP INFO
      // =====================================================
      shopName: {
        type: String,

        required: true,

        trim: true,
      },

      // =====================================================
      // EMAIL
      // =====================================================
      email: {
        type: String,

        required: true,

        unique: true,

        trim: true,

        lowercase: true,
      },

      // =====================================================
      // PASSWORD
      // =====================================================
      password: {
        type: String,

        required: true,
      },

      // =====================================================
      // PHONE
      // =====================================================
      phone: {
        type: String,

        default: "",

        trim: true,
      },

      // =====================================================
      // IMAGES
      // =====================================================
      bannerImage: {
        type: String,

        default: "",
      },

      logoImage: {
        type: String,

        default: "",
      },

      // =====================================================
      // ADDRESS
      // =====================================================
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

      // =====================================================
      // GEO LOCATION
      // =====================================================
      location: {
        type: {
          type: String,

          enum: ["Point"],

          required: true,

          default: "Point",
        },

        coordinates: {
          type: [Number], // [longitude, latitude]

          required: true,
        },
      },

      // =====================================================
      // ANALYTICS
      // =====================================================
      monthlyVisits: {
        type: Number,

        default: 0,
      },

      lastVisitReset: {
        type: Date,

        default: Date.now,
      },

      // =====================================================
      // PASSWORD RESET
      // =====================================================
      resetPasswordToken:
        String,

      resetPasswordExpire:
        Date,
    },
    {
      timestamps: true,
    }
  );

// =====================================================
// GEO INDEX
// =====================================================
sellerSchema.index({
  location: "2dsphere",
});

const Seller =
  mongoose.model(
    "Seller",
    sellerSchema
  );

export default Seller;
