import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Quote content is required"],
      trim: true,
    },
    author: {
      type: String,
      default: "Archive Reflection",
      trim: true,
    },
    category: {
      type: String,
      default: "Daily Reflection",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

quoteSchema.index({ content: "text", author: "text", category: "text" });

const Quote = mongoose.model("Quote", quoteSchema);

export default Quote;
