import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import SafetyScenario from "../models/SafetyScenario.js";

const rawFilePath = path.resolve(__dirname, "../../../data/safety_game_data.json");
const frontendDataPath = path.resolve(__dirname, "../../../frontend/src/data/safetyProtocols.json");

async function fixAndImportData() {
  console.log("Reading raw file from:", rawFilePath);
  let content = fs.readFileSync(rawFilePath, "utf-8");

  // Fix unescaped quotes inside summary fields like:
  // "summary": "Response: ... Say: "something" Do NOT: ...",
  // Replace inner unescaped quotes on summary lines
  const fixedContent = content.replace(
    /"summary":\s*"([\s\S]*?)",\s*\n\s*"overview"/g,
    (match, p1) => {
      // Escape any unescaped quotes inside the summary string
      const escapedSummary = p1.replace(/(?<!\\)"/g, '\\"');
      return `"summary": "${escapedSummary}",\n"overview"`;
    }
  );

  let parsedData;
  try {
    parsedData = JSON.parse(fixedContent);
    console.log("✅ Successfully parsed repaired JSON!");
  } catch (err) {
    console.error("❌ JSON Parse Error:", err.message);
    // Let's do a line-by-line repair if needed
    throw err;
  }

  const protocols = parsedData.safetyProtocols || [];
  console.log(`Found ${protocols.length} safety protocols.`);

  // Write the clean, perfectly formatted JSON back to files
  const cleanJsonString = JSON.stringify(parsedData, null, 2);
  fs.writeFileSync(rawFilePath, cleanJsonString, "utf-8");
  fs.writeFileSync(frontendDataPath, cleanJsonString, "utf-8");
  console.log("💾 Clean JSON written to data/safety_game_data.json and frontend/src/data/safetyProtocols.json");

  // Connect to MongoDB
  console.log("Connecting to MongoDB at:", process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB!");

  // Upsert into MongoDB
  let count = 0;
  for (const item of protocols) {
    await SafetyScenario.findOneAndUpdate(
      { id: item.id },
      { $set: item },
      { upsert: true, new: true }
    );
    count++;
  }

  console.log(`🎉 Successfully seeded ${count} Safety Protocols into MongoDB!`);
  await mongoose.disconnect();
  console.log("Database connection closed.");
}

fixAndImportData().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
