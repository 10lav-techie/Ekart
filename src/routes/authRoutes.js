import express from "express";

import {
  registerSeller,
  registerBuyer,
  loginUser,
  getSellerProfile,
  updateSellerProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

// ================= AUTH =================

// SELLER REGISTER
router.post(
  "/register-seller",
  registerSeller
);

// BUYER REGISTER
router.post(
  "/register-buyer",
  registerBuyer
);

// LOGIN (buyer + seller)
router.post(
  "/login",
  loginUser
);

// ================= PROFILE =================

router.get(
  "/profile",
  protect,
  getSellerProfile
);

router.put(
  "/profile",
  protect,
  updateSellerProfile
);

// ================= PASSWORD RESET =================

router.post(
  "/forgot-password",
  forgotPassword
);

router.put(
  "/reset-password/:token",
  resetPassword
);

export default router;