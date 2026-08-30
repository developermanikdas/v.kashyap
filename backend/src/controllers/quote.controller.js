import Quote from "../models/Quote.js";

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Get a random active quote from MongoDB
 */
export const getRandomQuote = async (req, res) => {
  try {
    const randomQuotes = await Quote.aggregate([
      { $match: { isActive: { $ne: false } } },
      { $sample: { size: 1 } },
    ]);

    if (randomQuotes && randomQuotes.length > 0) {
      return res.status(200).json({
        success: true,
        quote: randomQuotes[0],
      });
    }

    return res.status(404).json({
      success: false,
      message: "No active quotes found in the database",
    });
  } catch (error) {
    console.error("Failed to fetch random quote from DB:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * Get the daily quote (consistent for the current day from MongoDB)
 */
export const getDailyQuote = async (req, res) => {
  try {
    const totalCount = await Quote.countDocuments({ isActive: { $ne: false } });

    if (totalCount > 0) {
      // Calculate day of the year to pick a deterministic quote
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 0);
      const diff = now - startOfYear;
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      const skipIndex = dayOfYear % totalCount;

      const dailyQuote = await Quote.findOne({ isActive: { $ne: false } })
        .skip(skipIndex)
        .lean();

      if (dailyQuote) {
        return res.status(200).json({
          success: true,
          dayOfYear,
          quote: dailyQuote,
        });
      }
    }

    return res.status(404).json({
      success: false,
      message: "No daily quote found in database",
    });
  } catch (error) {
    console.error("Failed to fetch daily quote:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * Get all quotes with optional search, category filtering & pagination from MongoDB
 */
export const getAllQuotes = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 50 } = req.query;
    const filter = { isActive: { $ne: false } };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (search && typeof search === "string" && search.trim()) {
      const escaped = escapeRegex(search.trim());
      const regex = new RegExp(escaped, "i");
      filter.$or = [{ content: regex }, { author: regex }, { category: regex }];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const [quotes, total] = await Promise.all([
      Quote.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Quote.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: quotes,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error("Failed to fetch quotes:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * Get quote by ID from MongoDB
 */
export const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }
    return res.status(200).json({ success: true, data: quote });
  } catch (error) {
    console.error("Failed to fetch quote by ID:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create a new quote in MongoDB
 */
export const createQuote = async (req, res) => {
  try {
    const { content, author, category, isActive } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Quote content is required",
      });
    }

    const newQuote = await Quote.create({
      content: content.trim(),
      author: typeof author === "string" ? author.trim() : "Archive Reflection",
      category: typeof category === "string" ? category.trim() : "Daily Reflection",
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return res.status(201).json({
      success: true,
      message: "Quote created successfully",
      data: newQuote,
    });
  } catch (error) {
    console.error("Failed to create quote:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update an existing quote in MongoDB
 */
export const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, author, category, isActive } = req.body;

    const updateData = {};
    if (content !== undefined && typeof content === "string") updateData.content = content.trim();
    if (author !== undefined && typeof author === "string") updateData.author = author.trim();
    if (category !== undefined && typeof category === "string") updateData.category = category.trim();
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updated = await Quote.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quote updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Failed to update quote:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete a quote from MongoDB
 */
export const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Quote.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quote deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Failed to delete quote:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
