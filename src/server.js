
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
// =====================================================
// CONFIG
// =====================================================
dotenv.config();

// =====================================================
// APP
// =====================================================
const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================
app.use(cors());

app.use(express.json());

// =====================================================
// DATABASE
// =====================================================
connectDB();

// =====================================================
// ROUTES
// =====================================================
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/locations",
  locationRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

// =====================================================
// TEST ROUTE
// =====================================================
app.get("/", (req, res) => {
  res.json({
    message:
      "Backend running 🚀",
  });
});

// =====================================================
// SERVER
// =====================================================
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
