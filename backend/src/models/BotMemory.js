import mongoose from "mongoose";

const botMemorySchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    keywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

botMemorySchema.index({ topic: "text", keywords: "text", answer: "text" });

const BotMemory = mongoose.model("BotMemory", botMemorySchema);

export default BotMemory;
