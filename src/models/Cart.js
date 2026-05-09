import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    // ================= BUYER =================
    user: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

      unique: true,
    },

    // ================= CART ITEMS =================
    items: [
      {
        // PRODUCT
        product: {
          type:
            mongoose.Schema.Types.ObjectId,

          ref: "Product",

          required: true,
        },

        // SELLER / SHOP
        seller: {
          type:
            mongoose.Schema.Types.ObjectId,

          ref: "Seller",

          required: true,
        },

        // QUANTITY
        quantity: {
          type: Number,

          default: 1,

          min: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model(
  "Cart",
  cartSchema
);

export default Cart;