import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // ================= BUYER =================
    buyer: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    // ================= SELLER =================
    seller: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Seller",

      required: true,
    },

    // ================= ORDER ITEMS =================
    items: [
      {
        // PRODUCT
        product: {
          type:
            mongoose.Schema.Types.ObjectId,

          ref: "Product",

          required: true,
        },

        // PRODUCT NAME SNAPSHOT
        name: {
          type: String,

          required: true,
        },

        // PRODUCT IMAGE SNAPSHOT
        image: {
          type: String,

          default: "",
        },

        // PRICE SNAPSHOT
        price: {
          type: Number,

          required: true,
        },

        // QUANTITY
        quantity: {
          type: Number,

          required: true,

          min: 1,
        },
      },
    ],

    // ================= PICKUP DATE =================
    pickupDate: {
      type: Date,

      required: true,
    },

    // ================= ORDER STATUS =================
    status: {
      type: String,

      enum: [
        "pending",
        "accepted",
        "ready",
        "completed",
        "cancelled",
      ],

      default: "pending",
    },

    // ================= TOTAL =================
    totalAmount: {
      type: Number,

      required: true,
    },

    // ================= OPTIONAL NOTE =================
    note: {
      type: String,

      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model(
  "Order",
  orderSchema
);

export default Order;