const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const fileRoutes = require("./routes/fileRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use("/", fileRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
