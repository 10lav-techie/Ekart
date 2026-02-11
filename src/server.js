// Entry point
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use("/api/locations", locationRoutes);
// Middleware

app.use(express.json());
app.use("/api/seller", authRoutes);
app.use("/api/products", productRoutes);

// Connect DB
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
