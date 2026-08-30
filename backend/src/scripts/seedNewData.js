import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import SafetyScenario from "../models/SafetyScenario.js";

const rootDataDir = path.resolve(__dirname, "../../../data");
const frontendDataDir = path.resolve(__dirname, "../../../frontend/src/data");

async function seedAllNewData() {
  console.log("Reading new data files from:", rootDataDir);

  const safetyPath = path.join(rootDataDir, "safety.json");
  const storiesPath = path.join(rootDataDir, "stories.json");
  const thankYouPath = path.join(rootDataDir, "thank_you.json");

  const safetyData = JSON.parse(fs.readFileSync(safetyPath, "utf-8"));
  const storiesData = JSON.parse(fs.readFileSync(storiesPath, "utf-8"));
  const thankYouData = JSON.parse(fs.readFileSync(thankYouPath, "utf-8"));

  const safetyArray = Array.isArray(safetyData) ? safetyData : safetyData.safetyProtocols || [];
  const storiesArray = Array.isArray(storiesData) ? storiesData : storiesData.stories || [];
  const thankYouArray = Array.isArray(thankYouData) ? thankYouData : thankYouData.acknowledgments || [];

  console.log(`Loaded:
  - ${safetyArray.length} Safety Scenarios
  - ${storiesArray.length} Stories
  - ${thankYouArray.length} Thank You / Acknowledgment Entries`);

  // Copy canonical files to frontend/src/data/
  fs.writeFileSync(path.join(frontendDataDir, "safety.json"), JSON.stringify(safetyArray, null, 2), "utf-8");
  fs.writeFileSync(path.join(frontendDataDir, "stories.json"), JSON.stringify(storiesArray, null, 2), "utf-8");
  fs.writeFileSync(path.join(frontendDataDir, "thank_you.json"), JSON.stringify(thankYouArray, null, 2), "utf-8");

  // Remove old legacy files from frontend/src/data/
  const legacyFiles = [
    "Features.js",
    "SafetyScenarios.js",
    "safety_data.json",
    "thank_you_for_her.json",
    "safetyProtocols.json",
    "safetyProtocols.js",
    "archiveStories.js"
  ];

  for (const file of legacyFiles) {
    const p = path.join(frontendDataDir, file);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log(`Deleted legacy file: ${file}`);
    }
  }

  // Connect to MongoDB
  console.log("Connecting to MongoDB at:", process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB!");

  // Non-destructive upsert to preserve custom admin-added safety scenarios
  for (const sc of safetyArray) {
    await SafetyScenario.findOneAndUpdate(
      { $or: [{ id: sc.id }, { title: sc.title }] },
      { $set: sc },
      { upsert: true, returnDocument: "after" }
    );
  }

  const totalSafety = await SafetyScenario.countDocuments();
  console.log(`🎉 Successfully synced Safety Protocols! Total in MongoDB: ${totalSafety}`);

  await mongoose.disconnect();
  console.log("Database connection closed.");
}

seedAllNewData().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
