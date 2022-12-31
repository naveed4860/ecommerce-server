const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Order = require("../models/order");

// @route   POST api/orders
// @desc    Create an order
// @access  Private
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Create new order
    const newOrder = new Order({
      user: req.user.id,
      product: req.body.product,
      quantity: req.body.quantity,
    });

    // Save order to database
    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/orders
// @desc    Get all orders
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Find all orders
    const orders = await Order.find().populate("product", ["name", "price"]);
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    // Find order by ID
    const order = await Order.findById(req.params.id).populate("product", [
      "name",
      "price",
    ]);

    // Check if order exists
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(500).send("Server Error");
  }
});
// @route   PUT api/orders/:id
// @desc    Update order by ID
// @access  Private
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    // Find order by ID
    const order = await Order.findById(req.params.id);

    // Check if order exists
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Check if user owns order
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Update order fields
    order.product = req.body.product;
    order.quantity = req.body.quantity;

    // Save updated order to database
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/orders/:id
// @desc    Delete order by ID
// @access  Private
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Find order by ID
    const order = await Order.findById(req.params.id);

    // Check if order exists
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Check if user owns order
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Delete order
    await order.remove();
    res.json({ msg: "Order removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
