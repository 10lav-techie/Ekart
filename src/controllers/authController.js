
import bcrypt from "bcryptjs";

import crypto from "crypto";

import User from "../models/User.js";

import Seller from "../models/Seller.js";

import generateToken from "../utils/generateToken.js";

import sendEmail from "../utils/sendEmail.js";

// =====================================================
// REGISTER SELLER
// =====================================================
export const registerSeller =
  async (req, res) => {
    try {
      const {
        ownerName,
        shopName,
        city,
        district,
        area,
        address,
        email,
        password,
        phone,
        bannerImage,
        logoImage,
        latitude,
        longitude,
      } = req.body;

      // =====================================================
      // CHECK EXISTING SELLER
      // =====================================================
      const existingSeller =
        await Seller.findOne({
          email,
        });

      if (existingSeller) {
        return res
          .status(400)
          .json({
            message:
              "Seller already exists",
          });
      }

      // =====================================================
      // HASH PASSWORD
      // =====================================================
      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      // =====================================================
      // CREATE SELLER
      // =====================================================
      const seller =
        await Seller.create({
          ownerName,

          shopName,

          city,

          district,

          area,

          address,

          email,

          password:
            hashedPassword,

          phone,

          bannerImage,

          logoImage,

          location: {
            type: "Point",

            coordinates: [
              parseFloat(
                longitude || 0
              ),

              parseFloat(
                latitude || 0
              ),
            ],
          },
        });

      // =====================================================
      // RESPONSE
      // =====================================================
      res.status(201).json({
        _id: seller._id,

        name:
          seller.ownerName,

        email:
          seller.email,

        role: "seller",

        token:
          generateToken(
            seller._id,
            "seller"
          ),

        seller,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Seller registration failed",
      });
    }
  };

// =====================================================
// REGISTER BUYER
// =====================================================
export const registerBuyer =
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      // =====================================================
      // CHECK EXISTING USER
      // =====================================================
      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {
        return res
          .status(400)
          .json({
            message:
              "User already exists",
          });
      }

      // =====================================================
      // HASH PASSWORD
      // =====================================================
      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      // =====================================================
      // CREATE BUYER
      // =====================================================
      const user =
        await User.create({
          name,

          email,

          password:
            hashedPassword,

          role: "buyer",
        });

      // =====================================================
      // RESPONSE
      // =====================================================
      res.status(201).json({
        _id: user._id,

        name: user.name,

        email:
          user.email,

        role: "buyer",

        token:
          generateToken(
            user._id,
            "buyer"
          ),
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Buyer registration failed",
      });
    }
  };

// =====================================================
// LOGIN USER / SELLER
// =====================================================
export const loginUser =
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      // =====================================================
      // TRY BUYER LOGIN
      // =====================================================
      const buyer =
        await User.findOne({
          email,
        });

      // =====================================================
      // BUYER FOUND
      // =====================================================
      if (buyer) {
        const isMatch =
          await bcrypt.compare(
            password,
            buyer.password
          );

        if (!isMatch) {
          return res
            .status(400)
            .json({
              message:
                "Invalid credentials",
            });
        }

        return res.json({
          _id: buyer._id,

          name:
            buyer.name,

          email:
            buyer.email,

          role: "buyer",

          token:
            generateToken(
              buyer._id,
              "buyer"
            ),
        });
      }

      // =====================================================
      // TRY SELLER LOGIN
      // =====================================================
      const seller =
        await Seller.findOne({
          email,
        });

      if (!seller) {
        return res
          .status(404)
          .json({
            message:
              "Account not found",
          });
      }

      // =====================================================
      // CHECK PASSWORD
      // =====================================================
      const isMatch =
        await bcrypt.compare(
          password,
          seller.password
        );

      if (!isMatch) {
        return res
          .status(400)
          .json({
            message:
              "Invalid credentials",
          });
      }

      // =====================================================
      // SELLER RESPONSE
      // =====================================================
      res.json({
        _id: seller._id,

        name:
          seller.ownerName,

        email:
          seller.email,

        role: "seller",

        token:
          generateToken(
            seller._id,
            "seller"
          ),

        seller,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Login failed",
      });
    }
  };

// =====================================================
// GET SELLER PROFILE
// =====================================================
export const getSellerProfile =
  async (req, res) => {
    try {
      const seller =
        await Seller.findById(
          req.user._id
        );

      if (!seller) {
        return res
          .status(404)
          .json({
            message:
              "Seller not found",
          });
      }

      res.json(seller);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch profile",
      });
    }
  };

// =====================================================
// UPDATE SELLER PROFILE
// =====================================================
export const updateSellerProfile =
  async (req, res) => {
    try {
      const seller =
        await Seller.findById(
          req.user._id
        );

      if (!seller) {
        return res
          .status(404)
          .json({
            message:
              "Seller not found",
          });
      }

      const {
        ownerName,
        shopName,
        city,
        district,
        area,
        address,
        phone,
        bannerImage,
        logoImage,
        lat,
        lng,
      } = req.body;

      seller.ownerName =
        ownerName ||
        seller.ownerName;

      seller.shopName =
        shopName ||
        seller.shopName;

      seller.city =
        city ||
        seller.city;

      seller.district =
        district ||
        seller.district;

      seller.area =
        area ||
        seller.area;

      seller.address =
        address ||
        seller.address;

      seller.phone =
        phone ||
        seller.phone;

      seller.bannerImage =
        bannerImage ||
        seller.bannerImage;

      seller.logoImage =
        logoImage ||
        seller.logoImage;

      // LOCATION
      if (lat && lng) {
        seller.location = {
          type: "Point",

          coordinates: [
            parseFloat(lng),

            parseFloat(lat),
          ],
        };
      }

      const updatedSeller =
        await seller.save();

      res.json(
        updatedSeller
      );
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Profile update failed",
      });
    }
  };

// =====================================================
// FORGOT PASSWORD
// =====================================================
export const forgotPassword =
  async (req, res) => {
    try {
      const { email } =
        req.body;

      let account =
        await User.findOne({
          email,
        });

      let role =
        "buyer";

      if (!account) {
        account =
          await Seller.findOne({
            email,
          });

        role = "seller";
      }

      if (!account) {
        return res
          .status(404)
          .json({
            message:
              "No account found",
          });
      }

      const resetToken =
        crypto
          .randomBytes(20)
          .toString("hex");

      account.resetPasswordToken =
        crypto
          .createHash(
            "sha256"
          )
          .update(resetToken)
          .digest("hex");

      account.resetPasswordExpire =
        Date.now() +
        10 * 60 * 1000;

      await account.save();

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      const message = `
You requested a password reset.

${resetUrl}
`;

      await sendEmail({
        email:
          account.email,

        subject:
          "Password Reset",

        message,
      });

      res.json({
        message:
          "Reset email sent",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to send reset email",
      });
    }
  };

// =====================================================
// RESET PASSWORD
// =====================================================
export const resetPassword =
  async (req, res) => {
    try {
      const resetPasswordToken =
        crypto
          .createHash(
            "sha256"
          )
          .update(
            req.params.token
          )
          .digest("hex");

      let account =
        await User.findOne({
          resetPasswordToken,

          resetPasswordExpire:
            {
              $gt: Date.now(),
            },
        });

      if (!account) {
        account =
          await Seller.findOne({
            resetPasswordToken,

            resetPasswordExpire:
              {
                $gt: Date.now(),
              },
          });
      }

      if (!account) {
        return res
          .status(400)
          .json({
            message:
              "Invalid or expired token",
          });
      }

      const hashedPassword =
        await bcrypt.hash(
          req.body.password,
          10
        );

      account.password =
        hashedPassword;

      account.resetPasswordToken =
        undefined;

      account.resetPasswordExpire =
        undefined;

      await account.save();

      res.json({
        message:
          "Password updated",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Password reset failed",
      });
    }
  };

