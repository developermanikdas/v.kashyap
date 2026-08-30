import crypto from "crypto";
import jwt from "jsonwebtoken";
import Story from "../models/Story.js";
import SafetyScenario from "../models/SafetyScenario.js";
import Acknowledgement from "../models/Acknowledgement.js";
import FeatureRequest from "../models/FeatureRequest.js";
import BotMemory from "../models/BotMemory.js";
import Quote from "../models/Quote.js";
import UserChatLog from "../models/UserChatLog.js";
import { retrieveRelevantKnowledge, generateRAGResponse } from "../services/rag.service.js";
import { processSandbotInstruction } from "../services/adminSandbot.service.js";

// Helper for constant-time string comparison
const safeCompare = (a = "", b = "") => {
  const hashA = crypto.createHash("sha256").update(String(a)).digest();
  const hashB = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
};

// Master Admin Authentication (Restricted Exclusively to Verified Credentials in .env)
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const validUsername = process.env.ADMIN_USERNAME?.trim();
    const validPassword = process.env.ADMIN_PASSWORD?.trim();

    if (!validUsername || !validPassword) {
      console.error("ADMIN_USERNAME or ADMIN_PASSWORD is not configured in environment variables.");
      return res.status(500).json({
        success: false,
        message: "Server configuration error: Admin credentials not configured.",
      });
    }

    const isUserValid = safeCompare(username?.trim(), validUsername);
    const isPassValid = safeCompare(password?.trim(), validPassword);

    if (isUserValid && isPassValid) {
      const token = jwt.sign(
        {
          username: validUsername,
          role: "master_admin",
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        success: true,
        message: "Admin authentication successful",
        token,
        admin: {
          username: validUsername,
          role: "master_admin",
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: "Access Denied: Invalid master admin credentials.",
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during admin authentication",
    });
  }
};

// ================= STORIES CRUD =================
export const createStory = async (req, res) => {
  try {
    const { id, title, subtitle, author, date, tag, entryNo, paragraphs, pullQuote, remainingParagraphs } = req.body;
    const storyId = id || `story_${Date.now()}`;

    const newStory = await Story.create({
      id: storyId,
      title: title?.trim(),
      subtitle: subtitle?.trim(),
      author: author?.trim() || "Manik",
      date: date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      tag: tag?.trim() || "Archive Entry",
      entryNo: entryNo?.trim() || "",
      paragraphs: Array.isArray(paragraphs) ? paragraphs : paragraphs ? paragraphs.split("\n\n").map((p) => p.trim()).filter(Boolean) : [],
      pullQuote: pullQuote?.trim() || "",
      remainingParagraphs: Array.isArray(remainingParagraphs) ? remainingParagraphs : remainingParagraphs ? remainingParagraphs.split("\n\n").map((p) => p.trim()).filter(Boolean) : [],
    });

    return res.status(201).json({ success: true, data: newStory });
  } catch (error) {
    console.error("Error creating story:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    // Whitelist only allowed fields
    const allowedKeys = ["title", "subtitle", "author", "date", "tag", "entryNo", "paragraphs", "pullQuote", "remainingParagraphs"];
    const updateData = {};

    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        if (key === "paragraphs" || key === "remainingParagraphs") {
          updateData[key] = Array.isArray(body[key])
            ? body[key]
            : typeof body[key] === "string"
            ? body[key].split("\n\n").map((p) => p.trim()).filter(Boolean)
            : [];
        } else if (typeof body[key] === "string") {
          updateData[key] = body[key].trim();
        } else {
          updateData[key] = body[key];
        }
      }
    }

    const updated = await Story.findOneAndUpdate({ id }, { $set: updateData }, { returnDocument: "after" }).select("-__v");
    if (!updated) return res.status(404).json({ success: false, message: "Story not found" });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating story:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Story.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ success: false, message: "Story not found" });

    return res.status(200).json({ success: true, message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error deleting story:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= SAFETY PROTOCOLS CRUD =================
export const createSafetyScenario = async (req, res) => {
  try {
    const data = req.body;
    const scenarioId = data.id || `s${Date.now().toString().slice(-4)}`;

    const newScenario = await SafetyScenario.create({
      id: scenarioId,
      num: data.num || "",
      category: data.category || "EVERYDAY PUBLIC HARASSMENT",
      categoryId: data.categoryId || "harassment",
      riskLevel: data.riskLevel || "Concerning",
      riskBadge: data.riskBadge || (data.riskLevel || "Concerning").toUpperCase(),
      title: data.title?.trim() || "",
      summary: data.summary?.trim() || "",
      overview: data.overview?.trim() || "",
      assessmentCriteria: Array.isArray(data.assessmentCriteria) ? data.assessmentCriteria : [],
      verbalScripts: Array.isArray(data.verbalScripts) ? data.verbalScripts : [],
      prohibitedActions: Array.isArray(data.prohibitedActions) ? data.prohibitedActions : [],
      escalationSteps: Array.isArray(data.escalationSteps) ? data.escalationSteps : [],
    });

    return res.status(201).json({ success: true, data: newScenario });
  } catch (error) {
    console.error("Error creating safety scenario:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSafetyScenario = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    // Whitelist only allowed fields
    const allowedKeys = [
      "num",
      "category",
      "categoryId",
      "riskLevel",
      "riskBadge",
      "title",
      "summary",
      "overview",
      "assessmentCriteria",
      "verbalScripts",
      "prohibitedActions",
      "escalationSteps",
    ];

    const updateData = {};
    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        if (Array.isArray(body[key])) {
          updateData[key] = body[key];
        } else if (typeof body[key] === "string") {
          updateData[key] = body[key].trim();
        } else {
          updateData[key] = body[key];
        }
      }
    }

    const updated = await SafetyScenario.findOneAndUpdate({ id }, { $set: updateData }, { returnDocument: "after" }).select("-__v");
    if (!updated) return res.status(404).json({ success: false, message: "Scenario not found" });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating safety scenario:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSafetyScenario = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SafetyScenario.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ success: false, message: "Scenario not found" });

    return res.status(200).json({ success: true, message: "Scenario deleted successfully" });
  } catch (error) {
    console.error("Error deleting safety scenario:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= ACKNOWLEDGMENTS CRUD =================
export const updateAcknowledgement = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    // Whitelist only allowed fields
    const allowedKeys = ["quote", "author", "meta"];
    const updateData = {};

    for (const key of allowedKeys) {
      if (body[key] !== undefined && typeof body[key] === "string") {
        updateData[key] = body[key].trim();
      }
    }

    const updated = await Acknowledgement.findOneAndUpdate({ id }, { $set: updateData }, { returnDocument: "after" }).select("-__v");
    if (!updated) return res.status(404).json({ success: false, message: "Acknowledgement not found" });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating acknowledgement:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAcknowledgement = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Acknowledgement.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ success: false, message: "Acknowledgement not found" });

    return res.status(200).json({ success: true, message: "Acknowledgement deleted successfully" });
  } catch (error) {
    console.error("Error deleting acknowledgement:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= FEATURE REQUESTS =================
export const deleteFeatureRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FeatureRequest.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Feature request not found" });

    return res.status(200).json({ success: true, message: "Feature request deleted" });
  } catch (error) {
    console.error("Error deleting feature request:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= BOT MEMORY FEED CRUD =================
export const getAllBotMemories = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }

    const memories = await BotMemory.find(filter).select("-__v").sort({ priority: -1, createdAt: -1 });
    return res.status(200).json({ success: true, count: memories.length, data: memories });
  } catch (error) {
    console.error("Error fetching bot memories:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createBotMemory = async (req, res) => {
  try {
    const { topic, category, keywords, answer, priority, isActive } = req.body;

    if (!topic || !answer) {
      return res.status(400).json({ success: false, message: "Topic and answer are required" });
    }

    const keywordArray = Array.isArray(keywords)
      ? keywords
      : keywords
      ? keywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean)
      : [];

    const newMemory = await BotMemory.create({
      topic: topic.trim(),
      category: category ? category.trim() : "General",
      keywords: keywordArray,
      answer: answer.trim(),
      priority: priority !== undefined ? Number(priority) : 1,
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({ success: true, data: newMemory });
  } catch (error) {
    console.error("Error creating bot memory:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBotMemory = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    // Whitelist only allowed fields
    const allowedKeys = ["topic", "category", "keywords", "answer", "priority", "isActive"];
    const updateData = {};

    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        if (key === "keywords") {
          updateData[key] = Array.isArray(body[key])
            ? body[key]
            : typeof body[key] === "string"
            ? body[key].split(",").map((k) => k.trim().toLowerCase()).filter(Boolean)
            : [];
        } else if (key === "priority") {
          updateData[key] = Number(body[key]);
        } else if (typeof body[key] === "string") {
          updateData[key] = body[key].trim();
        } else {
          updateData[key] = body[key];
        }
      }
    }

    const updated = await BotMemory.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: "after" }).select("-__v");
    if (!updated) return res.status(404).json({ success: false, message: "Memory record not found" });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating bot memory:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBotMemory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BotMemory.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Memory record not found" });

    return res.status(200).json({ success: true, message: "Memory deleted successfully" });
  } catch (error) {
    console.error("Error deleting bot memory:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= RAG SIMULATOR & TEST ENDPOINT =================
export const testRAGQuery = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, message: "Query text is required" });
    }

    const trimmedQuery = query.trim();
    const matchedMemories = await retrieveRelevantKnowledge(trimmedQuery, 4);

    const ragResult = await generateRAGResponse({
      userMessage: trimmedQuery,
      history: [],
      matchedMemories,
    });

    return res.status(200).json({
      success: true,
      query: trimmedQuery,
      reply: ragResult.reply,
      source: ragResult.source,
      model: ragResult.model || "direct",
      tokensUsed: ragResult.tokensUsed || 0,
      matchedMemories: matchedMemories.map((m) => ({
        _id: m._id,
        topic: m.topic,
        category: m.category,
        keywords: m.keywords,
        answer: m.answer,
        priority: m.priority,
        relevanceScore: m.relevanceScore,
      })),
    });
  } catch (error) {
    console.error("Error running RAG test simulator:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= QUOTES CRUD =================
export const getAllQuotesAdmin = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 100 } = req.query;
    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ content: regex }, { author: regex }, { category: regex }];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 100;
    const skip = (pageNum - 1) * limitNum;

    const [quotes, total] = await Promise.all([
      Quote.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Quote.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: quotes,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching quotes in admin:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createQuoteAdmin = async (req, res) => {
  try {
    const { content, author, category, isActive } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Quote content is required.",
      });
    }

    const newQuote = await Quote.create({
      content: content.trim(),
      author: author?.trim() || "Archive Reflection",
      category: category?.trim() || "Daily Reflection",
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Quote created successfully.",
      data: newQuote,
    });
  } catch (error) {
    console.error("Error creating quote in admin:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateQuoteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, author, category, isActive } = req.body;

    const updateData = {};
    if (content !== undefined) updateData.content = content.trim();
    if (author !== undefined) updateData.author = author.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await Quote.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Quote not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quote updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating quote in admin:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteQuoteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Quote.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Quote not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quote deleted successfully.",
      data: deleted,
    });
  } catch (error) {
    console.error("Error deleting quote in admin:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= SANDBOT MASTER AI COPILOT CHAT =================
export const handleSandbotChat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message instruction is required." });
    }

    const result = await processSandbotInstruction({
      adminMessage: message.trim(),
      conversationHistory: history,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in Sandbot AI Copilot:", error);
    return res.status(500).json({
      success: false,
      message: "Sandbot execution error",
      reply: `Master Admin Manik, I encountered an internal error processing your request: ${error.message}`,
    });
  }
};

// ================= USER CHAT AUDIT & SAFETY LOGS (IMMUTABLE) =================
export const getAllUserChatLogsAdmin = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};

    if (status === "deleted") {
      filter.clientDeleted = true;
    } else if (status === "active") {
      filter.clientDeleted = false;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { sessionTitle: regex },
        { userIdentifier: regex },
        { "messages.text": regex },
      ];
    }

    const chatLogs = await UserChatLog.find(filter)
      .select("sessionId sessionTitle userIdentifier totalMessages clientDeleted lastActivityAt createdAt messages")
      .sort({ lastActivityAt: -1 })
      .lean();

    // Map each session with last message preview
    const formatted = chatLogs.map((log) => {
      const lastMsg = log.messages?.[log.messages.length - 1] || null;
      const firstUserMsg = log.messages?.find((m) => m.sender === "user") || null;

      return {
        _id: log._id,
        sessionId: log.sessionId,
        sessionTitle: log.sessionTitle,
        userIdentifier: log.userIdentifier,
        totalMessages: log.totalMessages || log.messages?.length || 0,
        clientDeleted: log.clientDeleted || false,
        lastActivityAt: log.lastActivityAt || log.updatedAt || log.createdAt,
        createdAt: log.createdAt,
        firstQuestion: firstUserMsg?.text || "Conversation started",
        lastPreview: lastMsg?.text ? (lastMsg.text.length > 80 ? `${lastMsg.text.slice(0, 80)}...` : lastMsg.text) : "No messages",
        lastSender: lastMsg?.sender || "unknown",
      };
    });

    const totalLogs = await UserChatLog.countDocuments();
    const clientClearedCount = await UserChatLog.countDocuments({ clientDeleted: true });

    return res.status(200).json({
      success: true,
      stats: {
        totalSessions: totalLogs,
        clientCleared: clientClearedCount,
      },
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching user chat logs in admin:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserChatLogDetailAdmin = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const chatLog = await UserChatLog.findOne({ sessionId }).lean();

    if (!chatLog) {
      return res.status(404).json({ success: false, message: "Chat log session not found." });
    }

    return res.status(200).json({
      success: true,
      data: chatLog,
    });
  } catch (error) {
    console.error("Error fetching chat log detail:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Permanently delete a single user chat session log from MongoDB (Super Admin only)
 */
export const deleteUserChatLogAdmin = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const deleted = await UserChatLog.findOneAndDelete({ sessionId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User chat log session not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat log permanently deleted from database.",
      sessionId,
    });
  } catch (error) {
    console.error("Error deleting user chat log in admin:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Permanently purge all user chat session logs (Super Admin only)
 */
export const clearAllUserChatLogsAdmin = async (req, res) => {
  try {
    const result = await UserChatLog.deleteMany({});

    return res.status(200).json({
      success: true,
      message: `Successfully purged ${result.deletedCount} chat sessions from database.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error purging all user chat logs in admin:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

