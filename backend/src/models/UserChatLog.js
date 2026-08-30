import mongoose from "mongoose";

const messageItemSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
  },
  sender: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String,
    default: "rag_groq",
  },
  model: {
    type: String,
    default: "default",
  },
  matchedMemories: [
    {
      topic: String,
      category: String,
      score: Number,
    },
  ],
});

const userChatLogSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userIdentifier: {
      type: String,
      default: "Vanshika",
      trim: true,
    },
    sessionTitle: {
      type: String,
      default: "New Conversation",
      trim: true,
    },
    messages: [messageItemSchema],
    totalMessages: {
      type: Number,
      default: 0,
    },
    clientDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserChatLog = mongoose.model("UserChatLog", userChatLogSchema);

export default UserChatLog;
