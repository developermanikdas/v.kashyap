import mongoose from "mongoose";
import dotenv from "dotenv";
import Story from "../models/Story.js";
import Acknowledgement from "../models/Acknowledgement.js";

dotenv.config();

async function updateExistingAuthorsToManik() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB...");

  const storyResult = await Story.updateMany({}, { $set: { author: "Manik" } });
  console.log(`Updated ${storyResult.modifiedCount} stories to author: 'Manik'`);

  const ackResult = await Acknowledgement.updateMany({}, { $set: { author: "Manik" } });
  console.log(`Updated ${ackResult.modifiedCount} acknowledgements to author: 'Manik'`);

  const stories = await Story.find({}).select("title author").lean();
  console.log("\nCurrent Stories in MongoDB:");
  stories.forEach((s, idx) => console.log(`${idx + 1}. "${s.title}" - Author: ${s.author}`));

  const acks = await Acknowledgement.find({}).select("quote author").lean();
  console.log("\nCurrent Acknowledgements in MongoDB:");
  acks.slice(0, 5).forEach((a, idx) => console.log(`${idx + 1}. "${a.quote.slice(0, 40)}..." - Author: ${a.author}`));

  await mongoose.disconnect();
  console.log("\n✅ All existing stories and acknowledgements updated to 'Manik'!");
}

updateExistingAuthorsToManik();
