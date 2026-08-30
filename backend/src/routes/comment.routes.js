import express from "express";
import {
  getStoryComments,
  createStoryComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/:storyId/comments", getStoryComments);
router.post("/:storyId/comments", createStoryComment);

export default router;
