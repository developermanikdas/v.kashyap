import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import BotMemory from "../models/BotMemory.js";

async function exportAndSyncLiveMemories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB. Fetching all live bot memories...");

    const allDbMemories = await BotMemory.find({}).sort({ category: 1, priority: -1, createdAt: 1 }).lean();
    console.log(`Found ${allDbMemories.length} memories in MongoDB database.`);

    const formattedMemories = allDbMemories.map((m) => ({
      topic: m.topic,
      category: m.category,
      keywords: m.keywords,
      answer: m.answer,
      priority: m.priority || 1,
      isActive: m.isActive !== false,
    }));

    const fileContent = `import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import BotMemory from "../models/BotMemory.js";

/**
 * Live Synchronized Bot Memories (Fetched from MongoDB database)
 * Preserves all memories added via the Admin Dashboard.
 */
export const comprehensiveBotMemories = ${JSON.stringify(formattedMemories, null, 2)};

async function seedMemories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for Bot Memory sync/seed...");

    // 1. Fetch live DB count first
    const existingCount = await BotMemory.countDocuments();
    console.log(\`Current records in MongoDB: \${existingCount}\`);

    // 2. Non-destructive upsert: updates or adds topics without deleting any existing records
    for (const mem of comprehensiveBotMemories) {
      await BotMemory.findOneAndUpdate(
        { topic: mem.topic },
        { $set: mem },
        { upsert: true, returnDocument: "after" }
      );
    }

    const totalCount = await BotMemory.countDocuments();
    console.log(\`🎉 Bot Memories synced successfully! Total in DB: \${totalCount}\`);

    await mongoose.disconnect();
    console.log("Disconnected cleanly.");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedMemories();
`;

    const seedFilePath = path.resolve(__dirname, "seedBotMemories.js");
    fs.writeFileSync(seedFilePath, fileContent, "utf-8");
    console.log(`✅ seedBotMemories.js has been successfully updated with all ${allDbMemories.length} live database memories!`);

    await mongoose.disconnect();
    console.log("Disconnected cleanly.");
  } catch (error) {
    console.error("Export/Sync error:", error);
    process.exit(1);
  }
}

exportAndSyncLiveMemories();
