const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// DB
connectDB();

// Routes
app.use("/api", authRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("eKYC Backend Running 🚀");
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});