import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import Story from "../models/Story.js";
import Acknowledgement from "../models/Acknowledgement.js";
import SafetyScenario from "../models/SafetyScenario.js";
import Quote from "../models/Quote.js";
import Resource from "../models/Resource.js";

const rootDataDir = path.resolve(__dirname, "../../../data");

/**
 * Universal Non-Destructive Synchronizer
 * Fetches existing data from MongoDB and non-destructively upserts records.
 * NEVER deletes or drops user/admin created records.
 */
async function seedAllToMongoDB() {
  console.log("Connecting to MongoDB at:", process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB!");

  // 1. Stories (Upsert by id / title)
  const storiesPath = path.join(rootDataDir, "stories.json");
  if (fs.existsSync(storiesPath)) {
    const storiesData = JSON.parse(fs.readFileSync(storiesPath, "utf-8"));
    const storiesList = Array.isArray(storiesData) ? storiesData : storiesData.stories || [];

    for (const story of storiesList) {
      await Story.findOneAndUpdate(
        { $or: [{ id: story.id }, { title: story.title }] },
        { $set: story },
        { upsert: true, returnDocument: "after" }
      );
    }
    const totalStories = await Story.countDocuments();
    console.log(`✅ Synced Stories non-destructively. Total in DB: ${totalStories}`);
  }

  // 2. Acknowledgments (Upsert by quote)
  const thankYouPath = path.join(rootDataDir, "thank_you.json");
  if (fs.existsSync(thankYouPath)) {
    const thankYouData = JSON.parse(fs.readFileSync(thankYouPath, "utf-8"));
    const ackList = Array.isArray(thankYouData) ? thankYouData : thankYouData.acknowledgments || [];

    for (const ack of ackList) {
      await Acknowledgement.findOneAndUpdate(
        { quote: ack.quote },
        { $set: ack },
        { upsert: true, returnDocument: "after" }
      );
    }
    const totalAcks = await Acknowledgement.countDocuments();
    console.log(`✅ Synced Acknowledgments non-destructively. Total in DB: ${totalAcks}`);
  }

  // 3. Safety Protocols (Upsert by id / title)
  const safetyPath = path.join(rootDataDir, "safety.json");
  if (fs.existsSync(safetyPath)) {
    const safetyData = JSON.parse(fs.readFileSync(safetyPath, "utf-8"));
    const safetyList = Array.isArray(safetyData) ? safetyData : safetyData.safetyProtocols || [];

    for (const sc of safetyList) {
      await SafetyScenario.findOneAndUpdate(
        { $or: [{ id: sc.id }, { title: sc.title }] },
        { $set: sc },
        { upsert: true, returnDocument: "after" }
      );
    }
    const totalSafety = await SafetyScenario.countDocuments();
    console.log(`✅ Synced Safety Scenarios non-destructively. Total in DB: ${totalSafety}`);
  }

  // 4. Quotes / Daily Quotes (Upsert by content)
  const quotesPath = path.join(rootDataDir, "quotes.json");
  if (fs.existsSync(quotesPath)) {
    const quotesData = JSON.parse(fs.readFileSync(quotesPath, "utf-8"));
    const quotesList = Array.isArray(quotesData) ? quotesData : quotesData.quotes || [];

    for (const item of quotesList) {
      const formattedQuote = {
        content: item.content?.trim(),
        author: item.author?.trim() || "Archive Reflection",
        category: item.category?.trim() || "Daily Reflection",
        isActive: item.isActive !== undefined ? item.isActive : true,
      };
      await Quote.findOneAndUpdate(
        { content: formattedQuote.content },
        { $set: formattedQuote },
        { upsert: true, returnDocument: "after" }
      );
    }
    const totalQuotes = await Quote.countDocuments();
    console.log(`✅ Synced Quotes non-destructively. Total in DB: ${totalQuotes}`);
  }

  // 5. Resources / PDF Guides (Upsert by id / title)
  const resourcesPath = path.join(rootDataDir, "resources.json");
  if (fs.existsSync(resourcesPath)) {
    const resourcesData = JSON.parse(fs.readFileSync(resourcesPath, "utf-8"));
    const resourcesList = Array.isArray(resourcesData) ? resourcesData : resourcesData.resources || [];

    for (const resItem of resourcesList) {
      await Resource.findOneAndUpdate(
        { $or: [{ id: resItem.id }, { title: resItem.title }] },
        { $set: resItem },
        { upsert: true, returnDocument: "after" }
      );
    }
    const totalResources = await Resource.countDocuments();
    console.log(`✅ Synced Resources non-destructively. Total in DB: ${totalResources}`);
  }

  await mongoose.disconnect();
  console.log("🎉 All data safely synchronized to MongoDB without any deletions!");
}

seedAllToMongoDB().catch((err) => {
  console.error("Failed to sync MongoDB data:", err);
  process.exit(1);
});

