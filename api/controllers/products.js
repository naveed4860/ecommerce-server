const Product = require("../models/product");

// @desc    Create a product
// @route   POST api/products
// @access  Private
exports.createProduct = async (req, res) => {
  try {
    // Create new product
    const newProduct = new Product({
      user: req.user.id,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image,
    });

    // Save product to database
    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get all products
// @route   GET api/products
// @access  Private
exports.getProducts = async (req, res) => {
  try {
    // Find all products
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get product by ID
// @route   GET api/products/:id
// @access  Private
exports.getProductById = async (req, res) => {
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
};

// @desc    Update product by ID
// @route   PUT api/products/:id
// @access  Private
exports.updateProductById = async (req, res) => {
  try {
    // Find product by ID
    let product = await Product.findById(req.params.id);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Check if user owns the product
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Update product fields
    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;
    product.image = req.body.image;

    // Save updated product to database
    product = await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @desc    Delete product by ID
// @route   DELETE api/products/:id
// @access  Private
exports.deleteProductById = async (req, res) => {
  try {
    // Find product by ID
    const product = await Product.findById(req.params.id);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Check if user owns the product
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
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
};
