// Product routes
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getNearbyShops } from "../controllers/productController.js";
import {
  addProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getPublicProducts,
  getShopsByCategory,
  getProductsBySeller
} from "../controllers/productController.js";

const router = express.Router();

// Public routes
router.get("/public", getPublicProducts);
router.get("/shop/:sellerId", getProductsBySeller);
router.get("/shops-by-category", getShopsByCategory);
router.get("/nearby", getNearbyShops);



// Seller protected routes
router.get("/my", protect, getMyProducts);
router.get("/:id", protect, getProductById);
router.post("/", protect, addProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
