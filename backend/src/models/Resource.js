import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    chapterNumber: { type: Number },
    title: { type: String, required: true },
    pageRange: { type: String, default: "" },
    summary: { type: String, default: "" },
    keyPoints: [{ type: String }],
  },
  { _id: false }
);

const resourceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      default: "Safety & Wellbeing",
      trim: true,
      index: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    chapters: [chapterSchema],
    keyTakeaways: [{ type: String }],
    targetAudience: [{ type: String }],
    emergencyNotes: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    cloudinaryPublicId: {
      type: String,
      default: "",
      trim: true,
    },
    fileType: {
      type: String,
      default: "pdf",
      trim: true,
    },
    fileSize: {
      type: String,
      default: "535 KB",
      trim: true,
    },
    pagesCount: {
      type: Number,
      default: 37,
    },
    tags: [{ type: String }],
    isFeatured: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

resourceSchema.index({ title: "text", summary: "text", category: "text", tags: "text" });

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;
