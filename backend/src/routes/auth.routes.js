import express from "express";
import { login } from "../controllers/auth.controller.js";
import protect from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Protected by strict 5 attempts per 15 minutes limiter
router.post("/login", authLimiter, login);

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;