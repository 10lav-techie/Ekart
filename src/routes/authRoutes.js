// Auth routes
import express from "express";
import { registerSeller, loginSeller } from "../controllers/authController.js";
import { getSellerProfile, updateSellerProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();
router.get("/profile", protect, getSellerProfile);
router.put("/profile", protect, updateSellerProfile);
router.post("/register", registerSeller);
router.post("/login", loginSeller);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;
