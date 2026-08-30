import Acknowledgement from "../models/Acknowledgement.js";

export const getAllAcknowledgements = async (req, res) => {
  try {
    const entries = await Acknowledgement.find({})
      .select("id quote author meta createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (error) {
    console.error("Error fetching acknowledgements:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching acknowledgements",
    });
  }
};

export const createAcknowledgement = async (req, res) => {
  try {
    const { quote, author, meta } = req.body;

    if (!quote || !quote.trim() || !author || !author.trim()) {
      return res.status(400).json({
        success: false,
        message: "Quote and author name are required",
      });
    }

    // Sanitize author handle
    let cleanAuthor = author.trim().toUpperCase();
    if (cleanAuthor.includes("@")) {
      cleanAuthor = cleanAuthor.split("@")[0];
    }

    const id = `ack_${Date.now()}`;
    const newEntry = await Acknowledgement.create({
      id,
      quote: quote.trim(),
      author: cleanAuthor,
      meta: meta && meta.trim() ? meta.trim() : "Archive Contributor",
    });

    return res.status(201).json({
      success: true,
      data: {
        id: newEntry.id,
        quote: newEntry.quote,
        author: newEntry.author,
        meta: newEntry.meta,
      },
    });
  } catch (error) {
    console.error("Error creating acknowledgement:", error);
    return res.status(500).json({
      success: false,
      message: "Server error recording acknowledgement",
    });
  }
};
