
import Cart from "../models/Cart.js";

import Product from "../models/Product.js";

// =====================================================
// ADD TO CART
// =====================================================
export const addToCart =
  async (req, res) => {
    try {
      // =====================================================
      // USER VALIDATION
      // =====================================================
      if (!req.user) {
        return res.status(401).json({
          message:
            "User not authorized",
        });
      }

      const userId =
        req.user._id;

      const {
        productId,
        quantity,
      } = req.body;

      // =====================================================
      // PRODUCT CHECK
      // =====================================================
      const product =
        await Product.findById(
          productId
        );

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      // =====================================================
      // FIND CART
      // =====================================================
      let cart =
        await Cart.findOne({
          user: userId,
        });

      // =====================================================
      // CREATE CART
      // =====================================================
      if (!cart) {
        cart =
          await Cart.create({
            user: userId,

            items: [],
          });
      }

      // =====================================================
      // EXISTING ITEM
      // =====================================================
      const existingItem =
        cart.items.find(
          (item) =>
            item.product.toString() ===
            productId
        );

      // =====================================================
      // UPDATE QUANTITY
      // =====================================================
      if (existingItem) {
        existingItem.quantity +=
          quantity || 1;
      }

      // =====================================================
      // ADD NEW ITEM
      // =====================================================
      else {
        cart.items.push({
          product:
            product._id,

          seller:
            product.seller,

          quantity:
            quantity || 1,
        });
      }

      // =====================================================
      // SAVE
      // =====================================================
      await cart.save();

      // =====================================================
      // POPULATE
      // =====================================================
      await cart.populate([
        {
          path:
            "items.product",
        },

        {
          path:
            "items.seller",
        },
      ]);

      // =====================================================
      // RESPONSE
      // =====================================================
      res.json({
        message:
          "Added to cart",

        cart,
      });
    } catch (error) {
      console.log(
        "ADD TO CART ERROR:",
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// =====================================================
// GET CART
// =====================================================
export const getCart =
  async (req, res) => {
    try {
      const cart =
        await Cart.findOne({
          user:
            req.user._id,
        }).populate([
          {
            path:
              "items.product",
          },

          {
            path:
              "items.seller",
          },
        ]);

      if (!cart) {
        return res.json({
          items: [],
        });
      }

      res.json(cart);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch cart",
      });
    }
  };

// =====================================================
// REMOVE FROM CART
// =====================================================
export const removeFromCart =
  async (req, res) => {
    try {
      const {
        productId,
      } = req.params;

      const cart =
        await Cart.findOne({
          user:
            req.user._id,
        });

      if (!cart) {
        return res.status(404).json({
          message:
            "Cart not found",
        });
      }

      cart.items =
        cart.items.filter(
          (item) =>
            item.product.toString() !==
            productId
        );

      await cart.save();

      await cart.populate([
        {
          path:
            "items.product",
        },

        {
          path:
            "items.seller",
        },
      ]);

      res.json({
        message:
          "Item removed",

        cart,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Remove item failed",
      });
    }
  };

// =====================================================
// UPDATE QUANTITY
// =====================================================
export const updateCartQuantity =
  async (req, res) => {
    try {
      const {
        productId,
        quantity,
      } = req.body;

      if (quantity < 1) {
        return res.status(400).json({
          message:
            "Quantity must be at least 1",
        });
      }

      const cart =
        await Cart.findOne({
          user:
            req.user._id,
        });

      if (!cart) {
        return res.status(404).json({
          message:
            "Cart not found",
        });
      }

      const item =
        cart.items.find(
          (item) =>
            item.product.toString() ===
            productId
        );

      if (!item) {
        return res.status(404).json({
          message:
            "Cart item not found",
        });
      }

      item.quantity =
        quantity;

      await cart.save();

      await cart.populate([
        {
          path:
            "items.product",
        },

        {
          path:
            "items.seller",
        },
      ]);

      res.json({
        message:
          "Cart updated",

        cart,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Update quantity failed",
      });
    }
  };

// =====================================================
// CLEAR CART
// =====================================================
export const clearCart =
  async (req, res) => {
    try {
      const cart =
        await Cart.findOne({
          user:
            req.user._id,
        });

      if (!cart) {
        return res.status(404).json({
          message:
            "Cart not found",
        });
      }

      cart.items = [];

      await cart.save();

      res.json({
        message:
          "Cart cleared",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to clear cart",
      });
    }
  };
