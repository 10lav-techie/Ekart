// Product CRUD logic
import Product from "../models/Product.js";

/**
 * Add Product
 */
export const addProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, isNew } = req.body;

    const product = await Product.create({
      seller: req.seller._id,
      name,
      price,
      description,
      image,
      category,
      isNew,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);

    res.status(400).json({ message: error.message });
  }
};

/**
 * Get My Products
 */
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.seller._id });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update Product
 */
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, isNew } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.seller._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.category = category;
    product.isNew = isNew;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Delete Product
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.seller._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * Get Public Products
 */
export const getPublicProducts = async (req, res) => {
  try {
    const { city, district, search, category } = req.query;

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    let products = await Product.find(filter)
      .populate("seller", "shopName city district area")
      .sort({ createdAt: -1 });

    if (city) {
      products = products.filter(
        (product) =>
          product.seller.city.toLowerCase() === city.toLowerCase()
      );
    }

    if (district) {
      products = products.filter(
        (product) =>
          product.seller.district.toLowerCase() === district.toLowerCase()
      );
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/**
 * Get Products By Seller (Public Shop Page)
 */
export const getProductsBySeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    const products = await Product.find({ seller: sellerId })
      .populate("seller", "shopName city area address");

    if (!products.length) {
      return res.status(404).json({ message: "Shop not found or no products" });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
