import express from "express";
import {
  getAllStories,
  getStoryById,
  createStoryPublic,
} from "../controllers/story.controller.js";
import {
  getStoryComments,
  createStoryComment,
} from "../controllers/comment.controller.js";
import { publicPostLimiter } from "../middleware/rateLimiter.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllStories);
router.post("/", protect, publicPostLimiter, createStoryPublic);
router.get("/:id", getStoryById);
router.get("/:storyId/comments", getStoryComments);
router.post("/:storyId/comments", publicPostLimiter, createStoryComment);

export default router;
