import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import {
  adminLogin,
  createStory,
  updateStory,
  deleteStory,
  createSafetyScenario,
  updateSafetyScenario,
  deleteSafetyScenario,
  updateAcknowledgement,
  deleteAcknowledgement,
  deleteFeatureRequest,
  getAllBotMemories,
  createBotMemory,
  updateBotMemory,
  deleteBotMemory,
  testRAGQuery,
  handleSandbotChat,
  getAllQuotesAdmin,
  createQuoteAdmin,
  updateQuoteAdmin,
  deleteQuoteAdmin,
  getAllUserChatLogsAdmin,
  getUserChatLogDetailAdmin,
  deleteUserChatLogAdmin,
  clearAllUserChatLogsAdmin,
} from "../controllers/admin.controller.js";
import {
  createResource,
  updateResource,
  deleteResource,
} from "../controllers/resource.controller.js";
import { uploadPdf } from "../middleware/upload.js";

const router = express.Router();

// Public Admin Login protected by strict 5 attempts per 15 minutes limiter
router.post("/login", authLimiter, adminLogin);

// ================= MASTER ADMIN JWT AUTHENTICATION GUARD =================
// All routes below this line strictly require Authorization: Bearer <valid_master_admin_jwt>
router.use(adminAuth);

// Stories CRUD
router.post("/stories", createStory);
router.put("/stories/:id", updateStory);
router.delete("/stories/:id", deleteStory);

// Safety Protocols CRUD
router.post("/safety", createSafetyScenario);
router.put("/safety/:id", updateSafetyScenario);
router.delete("/safety/:id", deleteSafetyScenario);

// Acknowledgments CRUD
router.put("/acknowledgements/:id", updateAcknowledgement);
router.delete("/acknowledgements/:id", deleteAcknowledgement);

// Feature Requests Management
router.delete("/features/:id", deleteFeatureRequest);

// Quotes CRUD
router.get("/quotes", getAllQuotesAdmin);
router.post("/quotes", createQuoteAdmin);
router.put("/quotes/:id", updateQuoteAdmin);
router.delete("/quotes/:id", deleteQuoteAdmin);

// Resources CRUD (Auto uploads PDF to Cloudinary)
router.post("/resources", uploadPdf.single("file"), createResource);
router.put("/resources/:id", uploadPdf.single("file"), updateResource);
router.delete("/resources/:id", deleteResource);

// Bot Memory Feed CRUD & RAG Simulator
router.get("/bot-memories", getAllBotMemories);
router.post("/bot-memories", createBotMemory);
router.post("/bot-memories/test-rag", testRAGQuery);
router.put("/bot-memories/:id", updateBotMemory);
router.delete("/bot-memories/:id", deleteBotMemory);

// User Chat Audit & Safety Logs (Admin Management & Permanent Deletion)
router.get("/user-chats", getAllUserChatLogsAdmin);
router.get("/user-chats/:sessionId", getUserChatLogDetailAdmin);
router.delete("/user-chats/:sessionId", deleteUserChatLogAdmin);
router.delete("/user-chats", clearAllUserChatLogsAdmin);

// Sandbot Admin AI Copilot
router.post("/ai-agent/chat", handleSandbotChat);

export default router;
