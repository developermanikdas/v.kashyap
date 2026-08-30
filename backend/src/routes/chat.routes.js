import express from "express";
import {
  handleChatMessage,
  getUserChatSessions,
  getSessionMessages,
  deleteUserChatSession,
} from "../controllers/chat.controller.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Message exchange endpoint (with rate limiter)
router.post("/message", apiLimiter, handleChatMessage);

// User Chat Sessions & History management
router.get("/sessions", getUserChatSessions);
router.get("/sessions/:sessionId", getSessionMessages);
router.delete("/sessions/:sessionId", deleteUserChatSession);

export default router;
