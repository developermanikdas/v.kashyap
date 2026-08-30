import Story from "../models/Story.js";

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const getAllStories = async (req, res) => {
  try {
    const { tag, search } = req.query;
    const query = {};

    if (tag && tag !== "ALL ENTRIES") {
      query.tag = { $regex: new RegExp(escapeRegex(tag), "i") };
    }

    if (search && search.trim()) {
      const escaped = escapeRegex(search.trim());
      const regex = new RegExp(escaped, "i");
      query.$or = [
        { title: regex },
        { subtitle: regex },
        { paragraphs: regex },
        { tag: regex },
        { author: regex },
      ];
    }

    const stories = await Story.find(query)
      .select("id title subtitle author date tag entryNo paragraphs pullQuote remainingParagraphs createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: stories.length,
      data: stories,
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching stories",
    });
  }
};

export const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findOne({ id }).select(
      "id title subtitle author date tag entryNo paragraphs pullQuote remainingParagraphs createdAt"
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    console.error("Error fetching story by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching story",
    });
  }
};

/**
 * Public/Member story creation (Supports submissions by Vanshika, Manik, or dedicated members)
 */
export const createStoryPublic = async (req, res) => {
  try {
    const { title, subtitle, author, tag, paragraphs, pullQuote, remainingParagraphs } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required for the story",
      });
    }

    const totalStories = await Story.countDocuments();
    const formattedEntryNo = `Archive Entry No. ${String(totalStories + 1).padStart(3, "0")} — ${tag?.trim() || "Reflections"}`;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const customId = req.body.id || slug || `story-${Date.now()}`;

    // Format paragraphs array
    const parsedParagraphs = Array.isArray(paragraphs)
      ? paragraphs.filter(Boolean)
      : typeof paragraphs === "string"
      ? paragraphs.split("\n\n").map((p) => p.trim()).filter(Boolean)
      : [];

    const parsedRemaining = Array.isArray(remainingParagraphs)
      ? remainingParagraphs.filter(Boolean)
      : typeof remainingParagraphs === "string"
      ? remainingParagraphs.split("\n\n").map((p) => p.trim()).filter(Boolean)
      : [];

    const newStory = await Story.create({
      id: customId,
      entryNo: formattedEntryNo,
      title: title.trim(),
      subtitle: subtitle?.trim() || "",
      author: author?.trim() || "Vanshika",
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      tag: tag?.trim() || "Restoration Series",
      paragraphs: parsedParagraphs,
      pullQuote: pullQuote?.trim() || (parsedParagraphs[0] ? `"${parsedParagraphs[0]}"` : ""),
      remainingParagraphs: parsedRemaining,
    });

    return res.status(201).json({
      success: true,
      message: "Story published successfully to the archive",
      data: newStory,
    });
  } catch (error) {
    console.error("Error creating story:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to publish story",
    });
  }
};
