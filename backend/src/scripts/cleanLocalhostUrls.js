import dotenv from "dotenv";
import mongoose from "mongoose";
import BotMemory from "../models/BotMemory.js";

dotenv.config();

async function cleanLocalhost() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const memories = await BotMemory.find({
      answer: { $regex: "http://localhost:5000", $options: "i" },
    });

    console.log(`Found ${memories.length} BotMemory documents containing http://localhost:5000`);

    for (const mem of memories) {
      const newAnswer = mem.answer.replace(/http:\/\/localhost:5000/gi, "");
      await BotMemory.updateOne(
        { _id: mem._id },
        { $set: { answer: newAnswer, lastModifiedBy: "System URL Clean" } }
      );
      console.log(`Cleaned memory: "${mem.topic}"`);
    }

    console.log("Completed cleaning all BotMemory records.");
  } catch (err) {
    console.error("Error cleaning URLs:", err);
  } finally {
    await mongoose.disconnect();
  }
}

cleanLocalhost();
