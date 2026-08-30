import mongoose from "mongoose";

const acknowledgementSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    quote: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    meta: {
      type: String,
      default: "Archive Contributor",
      trim: true,
    },
  },
  { timestamps: true }
);

const Acknowledgement = mongoose.model("Acknowledgement", acknowledgementSchema);

export default Acknowledgement;
