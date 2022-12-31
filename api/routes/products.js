const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Product = require("../models/product");

// @route   POST api/products
// @desc    Create a product
// @access  Private
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Create new product
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
    });

    // Save product to database
    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/products
// @desc    Get all products
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Find all products
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Private
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    // Find product by ID
    const product = await Product.findById(req.params.id);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/products/:id
// @desc    Update product by ID
// @access  Private
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    // Find product by ID
    const product = await Product.findById(req.params.id);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Update product fields
    product.name = req.body.name;
    product.price = req.body.price;

    // Save updated product to database
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/products/:id
// @desc    Update product by ID
// @access  Private
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    // Find product by ID
    const product = await Product.findById(req.params.id);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Update product fields
    product.name = req.body.name;
    product.price = req.body.price;

    // Save updated product to database
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/products/:id
// @desc    Delete product by ID
// @access  Private
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Find product by ID
    const product = await Product.findById(req.params.id);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Delete product
    await product.remove();
    res.json({ msg: "Product removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server Error");
  }
});
module.exports = router;
