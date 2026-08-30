import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import Resource from "../models/Resource.js";

const resourcesJsonPath = path.resolve(__dirname, "../data/resources.json");

async function seedResources() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI is not defined in .env file.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB at:", mongoUri);
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB!");

  if (!fs.existsSync(resourcesJsonPath)) {
    console.error(`❌ resources.json not found at ${resourcesJsonPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(resourcesJsonPath, "utf-8");
  const resourcesList = JSON.parse(rawData);

  console.log(`Loaded ${resourcesList.length} resources from ${resourcesJsonPath}`);

  // Upsert resources by id to preserve any additions
  for (const item of resourcesList) {
    await Resource.findOneAndUpdate({ id: item.id }, item, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  }

  const totalCount = await Resource.countDocuments();
  console.log(`✅ Successfully seeded Resources into MongoDB! (Total active resources: ${totalCount})`);

  await mongoose.disconnect();
  console.log("🎉 Database connection closed.");
}

seedResources().catch((err) => {
  console.error("❌ Failed to seed resources:", err);
  process.exit(1);
});
