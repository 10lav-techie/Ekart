
import jwt from "jsonwebtoken";

import User from "../models/User.js";

import Seller from "../models/Seller.js";

// =====================================================
// PROTECT ROUTES
// =====================================================
export const protect =
  async (req, res, next) => {
    try {
      let token;

      // =====================================================
      // GET TOKEN
      // =====================================================
      if (
        req.headers
          .authorization &&
        req.headers.authorization.startsWith(
          "Bearer"
        )
      ) {
        token =
          req.headers.authorization.split(
            " "
          )[1];
      }

      // =====================================================
      // NO TOKEN
      // =====================================================
      if (!token) {
        return res
          .status(401)
          .json({
            message:
              "Not authorized, no token",
          });
      }

      // =====================================================
      // VERIFY TOKEN
      // =====================================================
      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      // =====================================================
      // BUYER
      // =====================================================
      if (
        decoded.role ===
        "buyer"
      ) {
        const user =
          await User.findById(
            decoded.id
          ).select(
            "-password"
          );

        if (!user) {
          return res
            .status(404)
            .json({
              message:
                "Buyer not found",
            });
        }

        req.user = user;

        return next();
      }

      // =====================================================
      // SELLER
      // =====================================================
      if (
        decoded.role ===
        "seller"
      ) {
        const seller =
          await Seller.findById(
            decoded.id
          ).select(
            "-password"
          );

        if (!seller) {
          return res
            .status(404)
            .json({
              message:
                "Seller not found",
            });
        }

        req.user = seller;

        req.seller =
          seller;

        return next();
      }

      // =====================================================
      // INVALID ROLE
      // =====================================================
      return res
        .status(401)
        .json({
          message:
            "Invalid token role",
        });
    } catch (error) {
      console.log(error);

      res.status(401).json({
        message:
          "Not authorized, token failed",
      });
    }
  };

// =====================================================
// SELLER ONLY
// =====================================================
export const sellerOnly = (
  req,
  res,
  next
) => {
  if (req.seller) {
    return next();
  }

  res.status(403).json({
    message:
      "Seller access only",
  });
};

// =====================================================
// BUYER ONLY
// =====================================================
export const buyerOnly = (
  req,
  res,
  next
) => {
  if (
    req.user &&
    !req.seller
  ) {
    return next();
  }

  res.status(403).json({
    message:
      "Buyer access only",
  });
};
