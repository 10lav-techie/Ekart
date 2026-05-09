
import Cart from "../models/Cart.js";

import Order from "../models/Order.js";

// =====================================================
// PLACE ORDER
// =====================================================
export const placeOrder =
  async (req, res) => {
    try {
      const userId =
        req.user._id;

      const {
        pickupDate,
        note,
      } = req.body;

      // =====================================================
      // GET CART
      // =====================================================
      const cart =
        await Cart.findOne({
          user: userId,
        }).populate(
          "items.product"
        );

      if (
        !cart ||
        cart.items.length === 0
      ) {
        return res.status(400).json({
          message:
            "Cart is empty",
        });
      }

      // =====================================================
      // GROUP ITEMS BY SELLER
      // =====================================================
      const sellerMap =
        {};

      cart.items.forEach(
        (item) => {
          const sellerId =
            item.seller.toString();

          if (
            !sellerMap[
              sellerId
            ]
          ) {
            sellerMap[
              sellerId
            ] = [];
          }

          sellerMap[
            sellerId
          ].push(item);
        }
      );

      // =====================================================
      // CREATE ORDERS
      // =====================================================
      const createdOrders =
        [];

      for (const sellerId in sellerMap) {
        const sellerItems =
          sellerMap[
            sellerId
          ];

        let totalAmount = 0;

        const orderItems =
          sellerItems.map(
            (item) => {
              const product =
                item.product;

              totalAmount +=
                product.price *
                item.quantity;

              return {
                product:
                  product._id,

                name:
                  product.name,

                image:
                  product.image,

                price:
                  product.price,

                quantity:
                  item.quantity,
              };
            }
          );

        // =====================================================
        // CREATE ORDER
        // =====================================================
        const order =
          await Order.create({
            buyer:
              userId,

            seller:
              sellerId,

            items:
              orderItems,

            pickupDate,

            note,

            totalAmount,
          });

        createdOrders.push(
          order
        );
      }

      // =====================================================
      // CLEAR CART
      // =====================================================
      cart.items = [];

      await cart.save();

      res.status(201).json({
        message:
          "Orders placed successfully",

        orders:
          createdOrders,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Order placement failed",
      });
    }
  };

// =====================================================
// GET BUYER ORDERS
// =====================================================
export const getBuyerOrders =
  async (req, res) => {
    try {
      const orders =
        await Order.find({
          buyer:
            req.user._id,
        })
          .populate(
            "seller"
          )
          .sort({
            createdAt: -1,
          });

      res.json(orders);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch buyer orders",
      });
    }
  };

// =====================================================
// GET SELLER ORDERS
// =====================================================
export const getSellerOrders =
  async (req, res) => {
    try {
      const orders =
        await Order.find({
          seller:
            req.seller._id,
        })
          .populate(
            "buyer",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.json(orders);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch seller orders",
      });
    }
  };

// =====================================================
// UPDATE ORDER STATUS
// =====================================================
export const updateOrderStatus =
  async (req, res) => {
    try {
      const {
        status,
      } = req.body;

      // =====================================================
      // VALID STATUS
      // =====================================================
      const allowedStatuses =
        [
          "pending",
          "accepted",
          "ready",
          "completed",
          "cancelled",
        ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid status",
        });
      }

      // =====================================================
      // FIND ORDER
      // =====================================================
      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      // =====================================================
      // SECURITY CHECK
      // =====================================================
      if (
        order.seller.toString() !==
        req.seller._id.toString()
      ) {
        return res.status(403).json({
          message:
            "Not authorized",
        });
      }

      // =====================================================
      // UPDATE STATUS
      // =====================================================
      order.status =
        status;

      await order.save();

      res.json({
        message:
          "Order status updated",

        order,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to update order",
      });
    }
  };
