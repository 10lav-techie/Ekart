
import express from "express";

import {
  addToCart,

  getCart,

  removeFromCart,

  updateCartQuantity,

  clearCart,
} from "../controllers/cartController.js";

import {
  protect,
  buyerOnly,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

// =====================================================
// ALL CART ROUTES REQUIRE BUYER LOGIN
// =====================================================
router.use(
  protect,
  buyerOnly
);

// =====================================================
// GET CART
// =====================================================
router.get(
  "/",
  getCart
);

// =====================================================
// ADD TO CART
// =====================================================
router.post(
  "/add",
  addToCart
);

// =====================================================
// REMOVE ITEM
// =====================================================
router.delete(
  "/remove/:productId",
  removeFromCart
);

// =====================================================
// UPDATE QUANTITY
// =====================================================
router.put(
  "/update",
  updateCartQuantity
);

// =====================================================
// CLEAR CART
// =====================================================
router.delete(
  "/clear",
  clearCart
);

export default router;
