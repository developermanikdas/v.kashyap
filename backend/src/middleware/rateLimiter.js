import rateLimit from "express-rate-limit";

// Strict rate limiter for authentication endpoints (5 attempts per 15 minutes)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts from this IP. Please try again after 15 minutes.",
  },
});

// Feature request submission limiter (5 submissions per 30 minutes to prevent email spam)
export const featureLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "You have submitted multiple suggestions recently. Please wait a bit before sending another.",
  },
});

// Public content creation limiter (acknowledgements, stories, comments: 15 per 15 minutes)
export const publicPostLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Submission rate limit exceeded. Please wait a few minutes before posting again.",
  },
});

// General API rate limiter (300 requests per 15 minutes)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please slow down.",
  },
});
