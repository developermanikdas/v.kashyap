import axios from "axios";
import BotMemory from "../models/BotMemory.js";
import Story from "../models/Story.js";
import SafetyScenario from "../models/SafetyScenario.js";
import Acknowledgement from "../models/Acknowledgement.js";
import FeatureRequest from "../models/FeatureRequest.js";
import Quote from "../models/Quote.js";

/**
 * Read-only querying and draft structuring executed by Sandbot
 * (No direct database writes - all mutations must be approved & prefilled by the admin in the UI)
 */
export const executeSandbotTool = async (toolName, params = {}) => {
  switch (toolName) {
    // ================= 1. DATABASE STATS (READ ONLY) =================
    case "get_database_summary": {
      const [memoriesCount, storiesCount, safetyCount, acksCount, featuresCount, quotesCount] = await Promise.all([
        BotMemory.countDocuments(),
        Story.countDocuments(),
        SafetyScenario.countDocuments(),
        Acknowledgement.countDocuments(),
        FeatureRequest.countDocuments(),
        Quote.countDocuments(),
      ]);

      const pendingFeatures = await FeatureRequest.countDocuments({ status: "pending" });
      const activeMemories = await BotMemory.countDocuments({ isActive: true });
      const activeQuotes = await Quote.countDocuments({ isActive: { $ne: false } });

      return {
        success: true,
        summary: {
          botMemories: { total: memoriesCount, active: activeMemories },
          stories: storiesCount,
          safetyProtocols: safetyCount,
          acknowledgements: acksCount,
          featureRequests: { total: featuresCount, pending: pendingFeatures },
          quotes: { total: quotesCount, active: activeQuotes },
        },
      };
    }

    // ================= 2. SEARCH MEMORIES (READ ONLY) =================
    case "search_memories": {
      const { query, category } = params;
      const filter = {};
      if (category && category !== "all") {
        filter.category = category;
      }
      if (query && query.trim()) {
        const regex = new RegExp(query.trim(), "i");
        filter.$or = [{ topic: regex }, { answer: regex }, { keywords: regex }];
      }

      const results = await BotMemory.find(filter).sort({ priority: -1, createdAt: -1 }).limit(10).lean();
      return { success: true, count: results.length, data: results };
    }

    // ================= 3. SEARCH STORIES (READ ONLY) =================
    case "search_stories": {
      const { query } = params;
      const filter = {};
      if (query && query.trim()) {
        const regex = new RegExp(query.trim(), "i");
        filter.$or = [{ title: regex }, { subtitle: regex }, { tag: regex }];
      }
      const stories = await Story.find(filter).select("id title subtitle date tag entryNo").sort({ createdAt: -1 }).limit(10).lean();
      return { success: true, count: stories.length, data: stories };
    }

    // ================= 4. SEARCH SAFETY (READ ONLY) =================
    case "search_safety": {
      const { query } = params;
      const filter = {};
      if (query && query.trim()) {
        const regex = new RegExp(query.trim(), "i");
        filter.$or = [{ title: regex }, { summary: regex }, { category: regex }];
      }
      const scenarios = await SafetyScenario.find(filter).sort({ num: 1 }).limit(10).lean();
      return { success: true, count: scenarios.length, data: scenarios };
    }

    // ================= 5. FEATURE REQUESTS (READ ONLY) =================
    case "list_feature_requests": {
      const { status } = params;
      const filter = status && status !== "all" ? { status } : {};
      const features = await FeatureRequest.find(filter).sort({ createdAt: -1 }).limit(10).lean();
      return { success: true, count: features.length, data: features };
    }

    // ================= 6. DRAFTING TOOLS (PREFILL ONLY, NO DB MUTATION) =================
    case "draft_memory":
    case "add_memory": {
      const { topic, category, keywords, answer, priority = 4, isActive = true } = params;
      const keywordArr = Array.isArray(keywords)
        ? keywords
        : typeof keywords === "string"
        ? keywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean)
        : [];

      return {
        success: true,
        isDraft: true,
        suggestedDraft: {
          type: "botMemory",
          data: {
            topic: topic?.trim() || "New Knowledge Topic",
            category: category?.trim() || "About Her (Vanshika)",
            keywords: keywordArr,
            answer: answer?.trim() || "",
            priority: Number(priority) || 4,
            isActive: Boolean(isActive),
          },
        },
      };
    }

    case "draft_story":
    case "create_story": {
      const { title, subtitle, author, tag, paragraphs, pullQuote, date, remainingParagraphs } = params;
      return {
        success: true,
        isDraft: true,
        suggestedDraft: {
          type: "story",
          data: {
            title: title?.trim() || "New Archive Essay",
            subtitle: subtitle?.trim() || "",
            author: author?.trim() || "Manik",
            tag: tag?.trim() || "Restoration Series",
            paragraphs: Array.isArray(paragraphs) ? paragraphs : paragraphs ? [paragraphs] : [],
            pullQuote: pullQuote?.trim() || "",
            date: date?.trim() || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
            remainingParagraphs: Array.isArray(remainingParagraphs) ? remainingParagraphs : remainingParagraphs ? [remainingParagraphs] : [],
          },
        },
      };
    }

    case "draft_safety_scenario":
    case "create_safety_scenario": {
      const { title, summary, overview, riskLevel, category, assessmentCriteria, prohibitedActions } = params;
      return {
        success: true,
        isDraft: true,
        suggestedDraft: {
          type: "safety",
          data: {
            title: title?.trim() || "New Safety Protocol",
            summary: summary?.trim() || "",
            overview: overview?.trim() || summary?.trim() || "",
            category: category?.trim() || "EVERYDAY PUBLIC HARASSMENT",
            riskLevel: riskLevel?.trim() || "Concerning",
            assessmentCriteria: assessmentCriteria || [],
            prohibitedActions: prohibitedActions || [],
          },
        },
      };
    }

    case "draft_acknowledgement":
    case "create_acknowledgement": {
      const { quote, author, meta } = params;
      return {
        success: true,
        isDraft: true,
        suggestedDraft: {
          type: "ack",
          data: {
            quote: quote?.trim() || "",
            author: author?.trim() || "Manik",
            meta: meta?.trim() || "Archive Ledger Reflection",
          },
        },
      };
    }

    default:
      return { success: false, message: `Tool '${toolName}' is not recognized.` };
  }
};

/**
 * Sandbot Master AI Agent Dispatcher (Strict Drafting & Pre-filling Mode)
 */
export const processSandbotInstruction = async ({ adminMessage, conversationHistory = [] }) => {
  const groqApiKey = process.env.GROQ_API_KEY?.trim();
  const grokApiKey = process.env.GROK_API_KEY?.trim() || process.env.XAI_API_KEY?.trim();
  const apiKey = groqApiKey || grokApiKey;

  // Retrieve current database stats snapshot for context
  const stats = await executeSandbotTool("get_database_summary");

  const systemPrompt = `You are "Sandbot", the elite executive AI drafting copilot for Master Admin Manik (Developer Manik Das).

IMPORTANT OPERATIONAL RULE:
- You DO NOT perform direct database mutations (create, update, or delete).
- Instead, whenever Manik asks you to add, write, craft, or update anything (Stories, AI Knowledge Memories, Safety Protocols, or Acknowledgements), your job is to COMPOSE & DRAFT the complete structured data so that Manik can review and make changes directly in the input boxes before saving.
- You can query and search the database for summaries or research.

PRONOUNS & PERSONA:
- You address the admin as "Manik", "Sir", or "Master Admin" with utmost loyalty, warmth, and precision.
- You refer to Vanshika respectfully as "Vanshika", "Vanshu", or "Devi ji".
- You write beautiful, high-quality, thoughtful drafts.

AVAILABLE TOOLS:
1. "get_database_summary": {} - Fetches count of all records.
2. "search_memories": { "query": string, "category": string } - Searches BotMemory knowledge base.
3. "search_stories": { "query": string } - Searches essay stories.
4. "search_safety": { "query": string } - Searches safety protocols.
5. "list_feature_requests": { "status": "pending" | "reviewed" | "in-progress" | "completed" | "all" } - Lists suggestions.
6. "draft_memory": { "topic": string, "category": "About Her (Vanshika)" | "About Him (Manik)" | "Shared Memories & Moments" | "Creative Passions" | "Safety & Boundaries" | "Mindfulness & Reflection" | "General", "keywords": string[], "answer": string, "priority": 1-5 } - Generates a prefill draft for AI Chatbot Memory.
7. "draft_story": { "title": string, "subtitle": string, "tag": string, "paragraphs": string[], "pullQuote": string } - Generates a prefill draft for an Archive Essay.
8. "draft_safety_scenario": { "title": string, "summary": string, "riskLevel": string, "category": string } - Generates a prefill draft for Safety Protocol.
9. "draft_acknowledgement": { "quote": string, "author": string, "meta": string } - Generates a prefill draft for Acknowledgement.
10. "none": {} - Conversational reply without drafting.

CURRENT DATABASE SNAPSHOT:
${JSON.stringify(stats.summary)}

INSTRUCTION:
Respond ONLY with a strict valid JSON object in this exact format:
{
  "action": "<tool_name_or_none>",
  "parameters": { ... },
  "reply": "<Your warm, respectful response to Manik explaining what you drafted or answering his question. Mention that he can prefill the input boxes with this draft to make any edits.>"
}
Do not wrap in extra markdown backticks if possible, or use standard json.`;

  const messagesPayload = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.slice(-4).map((m) => ({
      role: m.sender === "user" || m.role === "user" ? "user" : "assistant",
      content: typeof m.text === "string" ? m.text : JSON.stringify(m),
    })),
    { role: "user", content: adminMessage.trim() },
  ];

  const isXAI = Boolean(grokApiKey && grokApiKey.startsWith("xai-"));
  const endpoint = isXAI
    ? "https://api.x.ai/v1/chat/completions"
    : "https://api.groq.com/openai/v1/chat/completions";

  const candidateModels = isXAI
    ? ["grok-2", "grok-beta"]
    : [
        process.env.GROQ_MODEL,
        "qwen/qwen3.8-27b",
        "groq/compound-mini",
        "openai/gpt-oss-20b",
      ].filter(Boolean);

  let rawLLMOutput = null;
  let modelUsed = "";

  for (const model of candidateModels) {
    try {
      const res = await axios.post(
        endpoint,
        {
          model,
          messages: messagesPayload,
          max_tokens: 600,
          temperature: 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 20000,
        }
      );

      rawLLMOutput = res.data?.choices?.[0]?.message?.content;
      modelUsed = model;
      if (rawLLMOutput) break;
    } catch (err) {
      console.warn(`[Sandbot Agent] Model ${model} call failed:`, err.message);
    }
  }

  if (!rawLLMOutput) {
    return {
      reply: "Manik, I encountered an issue connecting to the AI inference engine. Please check your API key status.",
      executedAction: "none",
      actionResult: null,
      suggestedDraft: null,
    };
  }

  // Parse JSON output from model
  let parsed = null;
  try {
    const cleaned = rawLLMOutput
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    parsed = JSON.parse(cleaned);
  } catch {
    const match = rawLLMOutput.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        parsed = {
          action: "none",
          parameters: {},
          reply: rawLLMOutput,
        };
      }
    } else {
      parsed = {
        action: "none",
        parameters: {},
        reply: rawLLMOutput,
      };
    }
  }

  const { action = "none", parameters = {}, reply = "" } = parsed;

  let toolResult = null;
  let suggestedDraft = null;

  if (action && action !== "none") {
    try {
      toolResult = await executeSandbotTool(action, parameters);
      if (toolResult?.suggestedDraft) {
        suggestedDraft = toolResult.suggestedDraft;
      }
    } catch (toolErr) {
      console.error(`[Sandbot Tool Execution Error] ${action}:`, toolErr.message);
      toolResult = { success: false, error: toolErr.message };
    }
  }

  return {
    reply: reply || "I have prepared the draft for you, Manik.",
    executedAction: action,
    actionResult: toolResult,
    suggestedDraft: suggestedDraft,
    modelUsed,
  };
};
