import FeatureRequest from "../models/FeatureRequest.js";
import { sendFeatureRequestNotification } from "../services/email.service.js";

// Public / Member Submission
export const createFeatureRequest = async (req, res) => {
  try {
    const { suggestion, user } = req.body;

    if (!suggestion || !suggestion.trim()) {
      return res.status(400).json({
        success: false,
        message: "Suggestion text is required",
      });
    }

    // Sanitize user name before saving
    let sanitizedUser = (user && user.trim()) ? user.trim() : "Archive Member";
    if (sanitizedUser.includes("@")) {
      sanitizedUser = sanitizedUser.split("@")[0];
    }

    const newRequest = await FeatureRequest.create({
      suggestion: suggestion.trim(),
      user: sanitizedUser,
      status: "pending",
    });

    // Trigger instant email alert to admin asynchronously (non-blocking background task)
    sendFeatureRequestNotification({
      user: sanitizedUser,
      suggestion: suggestion.trim(),
      createdAt: newRequest.createdAt,
      requestId: newRequest._id?.toString(),
    }).catch((err) => {
      console.error("⚠️ Background email notification error:", err.message);
    });

    return res.status(201).json({
      success: true,
      message: "Feature suggestion saved successfully",
      data: {
        _id: newRequest._id,
        suggestion: newRequest.suggestion,
        user: newRequest.user,
        status: newRequest.status,
        createdAt: newRequest.createdAt,
      },
    });
  } catch (error) {
    console.error("Error saving feature suggestion:", error);
    return res.status(500).json({
      success: false,
      message: "Server error saving feature suggestion",
    });
  }
};

// Sanitized Public / Community View (Hides raw emails / personal identifiers)
export const getAllFeatureRequests = async (req, res) => {
  try {
    const requests = await FeatureRequest.find({})
      .select("suggestion user status createdAt")
      .sort({ createdAt: -1 });

    const sanitized = requests.map((r) => ({
      _id: r._id,
      suggestion: r.suggestion,
      user: r.user ? (r.user.includes("@") ? r.user.split("@")[0] : r.user) : "Archive Member",
      status: r.status,
      createdAt: r.createdAt,
    }));

    return res.status(200).json({
      success: true,
      count: sanitized.length,
      data: sanitized,
    });
  } catch (error) {
    console.error("Error fetching feature requests:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching feature requests",
    });
  }
};

// Admin Only Status Updates
export const updateFeatureRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "reviewed", "in-progress", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updated = await FeatureRequest.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after" }
    ).select("suggestion user status createdAt updatedAt");

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Feature request not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Error updating feature request status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating feature request",
    });
  }
};
