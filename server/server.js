const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const { createTable } = require("./config/createTable");

// Route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const workerRoutes = require("./routes/workerRoutes");

// ---------------- CORS Configuration (FIX HERE) ----------------
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'https://www.stufix.space',
  'https://stufix.space',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        console.log('Blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// ---------------- Additional Security Headers ----------------
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- Health Check ----------------

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "College Complaint Management System Server is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development"
  });
});

// ---------------- API Routes ----------------

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/worker", workerRoutes);

// ---------------- 404 Handler ----------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// ---------------- Global Error Handler ----------------

app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// ---------------- Start Server ----------------

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await createTable();
    console.log("✅ Database tables created/verified successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📋 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 CORS enabled for: ${allowedOrigins.join(', ')}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();