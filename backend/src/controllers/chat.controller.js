import { retrieveRelevantKnowledge, generateRAGResponse } from "../services/rag.service.js";
import SafetyScenario from "../models/SafetyScenario.js";
import Story from "../models/Story.js";
import UserChatLog from "../models/UserChatLog.js";

export const handleChatMessage = async (req, res) => {
  try {
    const {
      message,
      history = [],
      sessionId,
      userIdentifier = "Vanshika",
      sessionTitle,
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const query = message.trim();
    const activeSessionId = sessionId?.trim() || `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    // 1. Retrieve most relevant knowledge snippets from BotMemory via RAG
    const matchedMemories = await retrieveRelevantKnowledge(query, 3);

    // 2. If query explicitly asks about safety/stories and no strong memory matched, supplement with scenario or story
    if (matchedMemories.length === 0) {
      const queryLower = query.toLowerCase();
      if (queryLower.includes("safe") || queryLower.includes("follow") || queryLower.includes("harass") || queryLower.includes("dec")) {
        const scenario = await SafetyScenario.findOne({
          $or: [
            { title: { $regex: new RegExp(queryLower.split(/\s+/).slice(0, 3).join("|"), "i") } },
            { summary: { $regex: new RegExp(queryLower.split(/\s+/).slice(0, 3).join("|"), "i") } },
          ],
        }).lean();

        if (scenario) {
          matchedMemories.push({
            topic: scenario.title,
            category: "Safety & Boundaries",
            answer: `${scenario.summary} Key action: ${scenario.escalationSteps?.[0]?.text || "Move to a populated safe location immediately."}`,
            relevanceScore: 5,
          });
        }
      } else if (queryLower.includes("story") || queryLower.includes("string") || queryLower.includes("essay")) {
        const story = await Story.findOne({}).lean();
        if (story) {
          matchedMemories.push({
            topic: story.title,
            category: "Archive Stories",
            answer: `From '${story.title}': "${story.pullQuote || story.paragraphs?.[0]}"`,
            relevanceScore: 4,
          });
        }
      }
    }

    // 3. Generate Token-Optimized RAG response using Groq / Grok LLM
    const ragResult = await generateRAGResponse({
      userMessage: query,
      history,
      matchedMemories,
    });

    const sanitizedMemories = ragResult.matchedMemories?.map((m) => ({
      topic: m.topic,
      category: m.category,
      score: m.relevanceScore,
    })) || [];

    // 4. Permanently archive conversation in MongoDB UserChatLog
    try {
      const generatedTitle =
        sessionTitle?.trim() ||
        (query.length > 38 ? `${query.slice(0, 38)}...` : query);

      const userMsgEntry = {
        sender: "user",
        text: query,
        timestamp: new Date(),
      };

      const botMsgEntry = {
        sender: "assistant",
        text: ragResult.reply,
        timestamp: new Date(),
        source: ragResult.source,
        model: ragResult.model || "direct",
        matchedMemories: sanitizedMemories,
      };

      await UserChatLog.findOneAndUpdate(
        { sessionId: activeSessionId },
        {
          $setOnInsert: {
            sessionId: activeSessionId,
            userIdentifier: userIdentifier?.trim() || "Vanshika",
            sessionTitle: generatedTitle,
            clientDeleted: false,
          },
          $push: {
            messages: { $each: [userMsgEntry, botMsgEntry] },
          },
          $inc: { totalMessages: 2 },
          $set: { lastActivityAt: new Date() },
        },
        { upsert: true, returnDocument: "after" }
      );
    } catch (logErr) {
      console.warn("⚠️ Failed to log conversation to MongoDB:", logErr.message);
    }

    return res.status(200).json({
      success: true,
      reply: ragResult.reply,
      source: ragResult.source,
      model: ragResult.model || "direct",
      tokensUsed: ragResult.tokensUsed,
      sessionId: activeSessionId,
      matchedMemories: sanitizedMemories,
    });
  } catch (error) {
    console.error("Error in RAG chat engine:", error);
    return res.status(500).json({
      success: false,
      message: "Chat engine error",
      reply: "The archive is here for quiet reflection, boundary awareness, and calm reassurance. What is on your mind?",
    });
  }
};

/**
 * Get active user chat sessions (Filtered by user identifier so users only see their own sessions)
 */
export const getUserChatSessions = async (req, res) => {
  try {
    const { userIdentifier } = req.query;
    const cleanUser = userIdentifier && typeof userIdentifier === "string" ? userIdentifier.trim() : "";

    if (!cleanUser) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const filter = {
      clientDeleted: false,
      userIdentifier: cleanUser,
    };

    const sessions = await UserChatLog.find(filter)
      .select("sessionId sessionTitle userIdentifier totalMessages lastActivityAt createdAt")
      .sort({ lastActivityAt: -1 })
      .limit(30)
      .lean();

    return res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error("Error fetching user chat sessions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chat sessions",
    });
  }
};

/**
 * Get messages for a specific session
 */
export const getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const chatLog = await UserChatLog.findOne({ sessionId }).lean();

    if (!chatLog) {
      return res.status(404).json({
        success: false,
        message: "Chat session not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: chatLog,
    });
  } catch (error) {
    console.error("Error fetching session messages:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch session messages",
    });
  }
};

/**
 * Client-Side Soft Delete: Marks session as deleted on client view
 * Note: The record is NEVER removed from the database for safety and audit purposes.
 */
export const deleteUserChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const updated = await UserChatLog.findOneAndUpdate(
      { sessionId },
      { $set: { clientDeleted: true } },
      { returnDocument: "after" }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat removed from your history",
      sessionId,
    });
  } catch (error) {
    console.error("Error soft-deleting chat session:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete chat session",
    });
  }
};
