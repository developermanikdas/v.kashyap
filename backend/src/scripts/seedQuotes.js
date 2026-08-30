import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import Quote from "../models/Quote.js";

const quotesJsonPath = path.resolve(__dirname, "../data/quotes.json");

async function seedQuotes() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI is not defined in .env file.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB at:", mongoUri);
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB!");

  if (!fs.existsSync(quotesJsonPath)) {
    console.error(`❌ quotes.json not found at ${quotesJsonPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(quotesJsonPath, "utf-8");
  const quotesList = JSON.parse(rawData);

  console.log(`Loaded ${quotesList.length} quotes from ${quotesJsonPath}`);

  // Format quotes with default categories if missing
  const formattedQuotes = quotesList.map((item) => ({
    content: item.content?.trim(),
    author: item.author?.trim() || "Archive Reflection",
    category: item.category?.trim() || "Daily Reflection",
    isActive: item.isActive !== undefined ? item.isActive : true,
  }));

  // Non-destructive upsert to preserve custom admin-added quotes
  for (const q of formattedQuotes) {
    await Quote.findOneAndUpdate(
      { content: q.content },
      { $set: q },
      { upsert: true, returnDocument: "after" }
    );
  }

  const totalQuotes = await Quote.countDocuments();
  console.log(`✅ Successfully synced Quotes! Total in MongoDB: ${totalQuotes}`);

  await mongoose.disconnect();
  console.log("🎉 Database connection closed.");
}

seedQuotes().catch((err) => {
  console.error("❌ Failed to seed quotes:", err);
  process.exit(1);
});
