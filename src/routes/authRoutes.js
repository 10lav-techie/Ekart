// Auth routes
import express from "express";
import { registerSeller, loginSeller } from "../controllers/authController.js";
import { getSellerProfile, updateSellerProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/profile", protect, getSellerProfile);
router.put("/profile", protect, updateSellerProfile);
router.post("/register", registerSeller);
router.post("/login", loginSeller);

export default router;
