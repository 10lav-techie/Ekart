// Seller auth logic
import Seller from "../models/Seller.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

/**
 * Register Seller
 */
export const registerSeller = async (req, res) => {
  try {
    const { ownerName, shopName, city, district, area, address, email, password } = req.body;


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
    });

    res.status(201).json({
      _id: seller._id,
      ownerName: seller.ownerName,
      shopName: seller.shopName,
      email: seller.email,
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

    const updatedSeller = await seller.save();

    res.json(updatedSeller);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
