const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post("/", async (req, res) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create new user
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Save user to database
    await user.save();

    // Create JWT
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Find all users
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.params.id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/users/:id
// @desc    Update user by ID
// @access  Private
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    // Find user by ID
    let user = await User.findById(req.params.id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if user owns the account
    if (user.id !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Update user fields
    user.name = req.body.name;
    user.email = req.body.email;
    if (req.body.password) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    // Save updated user to database
    user = await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/users/:id
// @desc    Delete user by ID
// @access  Private
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.params.id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if user owns the account
    if (user.id !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Delete user
    await user.remove();
    res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
