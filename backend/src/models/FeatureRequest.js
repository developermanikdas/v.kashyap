import mongoose from "mongoose";

const featureRequestSchema = new mongoose.Schema(
  {
    suggestion: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: String,
      default: "Anonymous Visitor",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "in-progress", "completed"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const FeatureRequest = mongoose.model("FeatureRequest", featureRequestSchema);

export default FeatureRequest;
