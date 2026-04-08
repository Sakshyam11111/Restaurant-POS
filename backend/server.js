const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// Import routes
const authRoutes         = require("./routes/authRoutes");
const staffRoutes        = require("./routes/staffRoutes");
const customerRoutes     = require("./routes/customerRoutes");
const tableRoutes        = require("./routes/tableRoutes");
const orderRoutes        = require("./routes/orderRoutes");
const menuRoutes         = require("./routes/menuRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const zoneRoutes         = require("./routes/zoneRoutes");
const designationRoutes  = require("./routes/designationRoutes");
const employeeRoutes     = require("./routes/employeeRoutes");

dotenv.config();

const app = express();

app.set("x-powered-by", false);
app.set("etag", false);

// Body parsing middleware – increased limit for base64 employee photos
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }),
);

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/restaurant-pos",
      {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
        bufferCommands: false,
        connectTimeoutMS: 10000,
      },
    );
    console.log("✓ MongoDB Connected Successfully");
  } catch (err) {
    console.error("✗ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

connectDB();

mongoose.connection.on("disconnected", () => { console.warn("MongoDB disconnected"); });
mongoose.connection.on("error", (err) => { console.error("MongoDB error:", err); });

// API Routes
console.log("Registering API routes...");

app.use("/api/auth",            authRoutes);
app.use("/api/staff",           staffRoutes);
app.use("/api/customer",        customerRoutes);
app.use("/api/tables",          tableRoutes);
app.use("/api/orders",          orderRoutes);
app.use("/api/menu",            menuRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/zones",           zoneRoutes);
app.use("/api/designations",    designationRoutes);
app.use("/api/employees",       employeeRoutes);

console.log("✓ Routes registered:");
console.log("  - /api/auth/*");
console.log("  - /api/staff/*");
console.log("  - /api/customer/*");
console.log("  - /api/tables/*");
console.log("  - /api/orders/*");
console.log("  - /api/menu/*");
console.log("  - /api/recommendations/*");
console.log("  - /api/zones/*");
console.log("  - /api/designations/*");
console.log("  - /api/employees/*");

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!", env: process.env.NODE_ENV || 'development' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Route not found", path: req.path });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n✓ Server running on port ${PORT}`);
  console.log(`✓ API URL: http://localhost:${PORT}/api`);
  console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
  console.log(`\nReady to accept requests! 🚀\n`);
});

server.keepAliveTimeout = 65000;
server.headersTimeout   = 66000;
server.timeout          = 60000;

module.exports = app;