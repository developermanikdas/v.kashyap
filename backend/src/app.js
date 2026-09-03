import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import mongoSanitizer from "./middleware/mongoSanitize.js";

import authRoutes from "./routes/auth.routes.js";
import quoteRoutes from "./routes/quote.routes.js";
import safetyRoutes from "./routes/safety.routes.js";
import storyRoutes from "./routes/story.routes.js";
import acknowledgementRoutes from "./routes/acknowledgement.routes.js";
import featureRequestRoutes from "./routes/featureRequest.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import resourceRoutes from "./routes/resource.routes.js";

const app = express();

// Disable express identification header
app.disable("x-powered-by");

// Apply secure HTTP headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

// Whitelist configuration for Localhost, LAN IPs (e.g. 192.168.x.x), Custom Domain, and Production domains
const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow non-browser requests (curl, server-to-server, mobile apps)

  const cleanOrigin = origin.trim().replace(/\/$/, "");

  // 1. Localhost and 127.0.0.1 on any port
  if (/^http:\/\/localhost(:\d+)?$/.test(cleanOrigin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(cleanOrigin)) {
    return true;
  }

  // 2. Local Area Network (LAN) IPs (e.g. 192.168.x.x, 10.x.x.x, 172.16.x.x) on any port
  if (/^http:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/.test(cleanOrigin)) {
    return true;
  }

  // 3. Custom Production Domain (e.g. vkashyap99.app, www.vkashyap99.app, *.vkashyap99.app)
  if (/^https?:\/\/([a-z0-9-]+\.)?vkashyap99\.app$/i.test(cleanOrigin)) {
    return true;
  }

  // 4. Configured production client URL(s) from environment (supports comma-separated list)
  if (process.env.CLIENT_URL) {
    const allowedClientUrls = process.env.CLIENT_URL.split(",").map((u) => u.trim().replace(/\/$/, ""));
    if (allowedClientUrls.includes(cleanOrigin)) {
      return true;
    }
  }

  // 5. Vercel, Netlify, and Render app domains
  if (/^https:\/\/[a-z0-9-]+(\.vercel\.app|\.netlify\.app|\.onrender\.com)$/i.test(cleanOrigin)) {
    return true;
  }

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS Policy: Access from origin ${origin} is forbidden.`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing with safe size bounds
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Prevent NoSQL query injection across all endpoints
app.use(mongoSanitizer);

// Root health & status
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "The Many Strings API is running 🚀",
  });
});

// Mounted REST API Routers
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/quotes", quoteRoutes);
app.use("/api/v1/safety", safetyRoutes);
app.use("/api/v1/stories", storyRoutes);
app.use("/api/v1/acknowledgements", acknowledgementRoutes);
app.use("/api/v1/features", featureRequestRoutes);
app.use("/api/v1/resources", resourceRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/chat", chatRoutes);

// Health check endpoint
app.get("/health-check", async (req, res) => {
  try {
    await mongoose.connection.db.command({ ping: 1 });
    res.json({ status: "ok", message: "Server and Database are alive!" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 404 Route Handler for undefined endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} does not exist on this server.`,
  });
});

// ================= CENTRALIZED ERROR HANDLING MIDDLEWARE =================
// Standardizes error responses and prevents leaking server stack traces in production
app.use((err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";
  console.error(`[${new Date().toISOString()}] Error on ${req.method} ${req.originalUrl}:`, err.message);

  // 1. CORS Policy Violations
  if (err.message && err.message.includes("CORS Policy")) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  // 2. JSON Body Parsing Errors
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Malformed JSON payload provided.",
    });
  }

  // 3. Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({
      success: false,
      message: `A record with that ${field} already exists.`,
    });
  }

  // 4. Mongoose Validation Error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: messages,
    });
  }

  // 5. Default Internal Server Error (Never leak stack traces in production)
  const statusCode = err.statusCode || err.status || 500;
  return res.status(statusCode).json({
    success: false,
    message: isProduction ? "An unexpected server error occurred." : err.message || "Internal server error",
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

export default app;