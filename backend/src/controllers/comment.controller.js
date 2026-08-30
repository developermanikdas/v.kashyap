import StoryComment from "../models/StoryComment.js";

export const getStoryComments = async (req, res) => {
  try {
    const { storyId } = req.params;
    const comments = await StoryComment.find({ storyId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reflections from database",
    });
  }
};

export const createStoryComment = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { author, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reflection content is required",
      });
    }

    const newComment = await StoryComment.create({
      storyId,
      author: author && author.trim() ? author.trim() : "Anonymous Reader",
      text: text.trim(),
    });

    return res.status(201).json({
      success: true,
      data: newComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save reflection to database",
    });
  }
};
