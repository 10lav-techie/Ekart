import express from "express";

import {
  placeOrder,
  getBuyerOrders,
  getSellerOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import {
  protect,
  buyerOnly,
  sellerOnly,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

// =====================================================
// PLACE ORDER
// BUYER ONLY
// =====================================================
router.post(
  "/place",
  protect,
  buyerOnly,
  placeOrder
);

// =====================================================
// GET BUYER ORDERS
// BUYER ONLY
// =====================================================
router.get(
  "/buyer",
  protect,
  buyerOnly,
  getBuyerOrders
);

// =====================================================
// GET SELLER ORDERS
// SELLER ONLY
// =====================================================
router.get(
  "/seller",
  protect,
  sellerOnly,
  getSellerOrders
);

// =====================================================
// UPDATE ORDER STATUS
// SELLER ONLY
// =====================================================
router.put(
  "/status/:id",
  protect,
  sellerOnly,
  updateOrderStatus
);

export default router;