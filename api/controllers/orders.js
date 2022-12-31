const Order = require("../models/order");

// @desc    Create an order
// @route   POST api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    // Create new order
    const newOrder = new Order({
      user: req.user.id,
      items: req.body.items,
    });

    // Save order to database
    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get all orders
// @route   GET api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    // Find all orders
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get order by ID
// @route   GET api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    // Find order by ID
    const order = await Order.findById(req.params.id);

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
};

// @desc    Update order by ID
// @route   PUT api/orders/:id
// @access  Private
exports.updateOrderById = async (req, res) => {
  try {
    // Find order by ID
    let order = await Order.findById(req.params.id);

    // Check if order exists
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Update order fields
    order.items = req.body.items;

    // Save updated order to database
    order = await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @desc    Delete order by ID
// @route   DELETE api/orders/:id
// @access  Private
exports.deleteOrderById = async (req, res) => {
  try {
    // Find order by ID
    const order = await Order.findById(req.params.id);

    // Check if order exists
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Check if user owns the order
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
};
