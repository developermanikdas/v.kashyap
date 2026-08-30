import mongoose from "mongoose";

const storyCommentSchema = new mongoose.Schema(
  {
    storyId: {
      type: String,
      required: true,
      index: true,
    },
    author: {
      type: String,
      default: "Anonymous Reader",
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const StoryComment = mongoose.model("StoryComment", storyCommentSchema);

export default StoryComment;
