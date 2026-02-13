// Seller auth logic
import Seller from "../models/Seller.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

/**
 * Register Seller
 */
export const registerSeller = async (req, res) => {
  try {
    const { ownerName, shopName, city, district, area, address, email, password, phone, bannerImage, logoImage } = req.body;


    const existingSeller = await Seller.findOne({ email });

    if (existingSeller) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await Seller.create({
      ownerName,
      shopName,
      district,
      city,
      area,
      address,
      email,
      password: hashedPassword,
      phone,
      bannerImage,
      logoImage,
    });

    res.status(201).json({
      _id: seller._id,
      ownerName: seller.ownerName,
      shopName: seller.shopName,
      email: seller.email,
      phone: seller.phone,
      bannerImage: seller.bannerImage,
      logoImage: seller.logoImage,
      token: generateToken(seller._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Login Seller
 */
export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: seller._id,
      ownerName: seller.ownerName,
      shopName: seller.shopName,
      email: seller.email,
      phone: seller.phone,
      bannerImage: seller.bannerImage,
      logoImage: seller.logoImage,
      token: generateToken(seller._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET SELLER PROFILE
export const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id).select("-password");
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE SELLER PROFILE
export const updateSellerProfile = async (req, res) => {
  try {
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
    } = req.body;

    const seller = await Seller.findById(req.seller._id);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.ownerName = ownerName;
    seller.shopName = shopName;
    seller.city = city;
    seller.district = district;
    seller.area = area;
    seller.address = address;
    seller.phone = phone;
    seller.bannerImage = bannerImage;
    seller.logoImage = logoImage;

    const updatedSeller = await seller.save();

    res.json(updatedSeller);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const seller = await Seller.findOne({ email: req.body.email });

    if (!seller) {
      return res.status(404).json({ message: "No account with this email" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    seller.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    seller.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

    await seller.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
You requested password reset.

Click the link below:

${resetUrl}

If you did not request this, ignore this email.
    `;

    await sendEmail({
      email: seller.email,
      subject: "Password Reset",
      message,
    });

    res.json({ message: "Reset link sent to email" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const seller = await Seller.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!seller) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    seller.password = hashedPassword;
    seller.resetPasswordToken = undefined;
    seller.resetPasswordExpire = undefined;

    await seller.save();

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
