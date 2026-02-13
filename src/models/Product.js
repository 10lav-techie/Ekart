import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true, // now required
    },
    category: {
      type: String,
      required: true,
      enum: ["Grocery", "Electronics", "Clothes", "Food", "Others"]
    },
    inStock: {
    type: Boolean,
    default: true,
    },

    isNew: {
      type: Boolean,
      default: false,
    },
    isTop: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ seller: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
