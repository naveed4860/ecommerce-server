const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const errorMiddleware = require("./api/middleware/error");

const ordersRoutes = require("./api/routes/orders");
const productsRoutes = require("./api/routes/products");
const usersRoutes = require("./api/routes/users");

// Load environment variables from .env file
require("dotenv").config();

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Enable CORS
app.use(cors());

// Use JSON parser for all requests
app.use(express.json());

// Use routes
app.use("/orders", ordersRoutes);
app.use("/products", productsRoutes);
app.use("/users", usersRoutes);

// Error handling middleware
app.use(errorMiddleware);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
