// Product routes
import express from "express";
import { getPublicProducts } from "../controllers/productController.js";
import { getProductsBySeller } from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";

import {
  addProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();
router.get("/public", getPublicProducts);
router.get("/shop/:sellerId", getProductsBySeller);

router.post("/", protect, addProduct);
router.get("/my", protect, getMyProducts);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
