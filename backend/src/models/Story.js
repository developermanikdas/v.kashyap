import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    entryNo: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "Vanshika",
      trim: true,
    },
    date: {
      type: String,
      default: "",
    },
    tag: {
      type: String,
      default: "Restoration Series",
      index: true,
    },
    paragraphs: [{ type: String }],
    pullQuote: {
      type: String,
      default: "",
    },
    remainingParagraphs: [{ type: String }],
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", storySchema);

export default Story;
