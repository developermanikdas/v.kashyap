import axios from "axios";
import Resource from "../models/Resource.js";
import cloudinary, { uploadFileToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return "Unknown";
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Get all active resources from MongoDB with search, filtering, and pagination
 */
export const getAllResources = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 50 } = req.query;
    const filter = { isActive: { $ne: false } };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (search && typeof search === "string" && search.trim()) {
      const escaped = escapeRegex(search.trim());
      const regex = new RegExp(escaped, "i");
      filter.$or = [
        { title: regex },
        { subtitle: regex },
        { summary: regex },
        { description: regex },
        { tags: regex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const [resources, total] = await Promise.all([
      Resource.find(filter)
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Resource.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: resources,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error("Failed to fetch resources from database:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * Get single resource by its slug or Mongo _id from MongoDB
 */
export const getResourceByIdOrSlug = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findOne({
      $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    }).lean();

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error("Failed to fetch resource by ID/slug from database:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Create a new resource in MongoDB (automatically uploads PDF file to Cloudinary)
 */
export const createResource = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      category,
      summary,
      description,
      fileUrl,
      cloudinaryPublicId,
      fileSize,
      pagesCount,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Document title (PDF name) is required.",
      });
    }

    const docSummary = summary?.trim() || description?.trim() || "Resource document available in archive.";
    const docDescription = description?.trim() || docSummary;

    let finalFileUrl = fileUrl?.trim();
    let finalPublicId = cloudinaryPublicId?.trim();
    let computedSize = fileSize?.trim() || "Unknown";
    let computedPages = Number(pagesCount) || 1;

    // 1. If a PDF file was uploaded via Multer, validate binary signature & upload directly to Cloudinary
    if (req.file) {
      const header = req.file.buffer.slice(0, 5).toString("utf-8");
      if (!header.startsWith("%PDF-")) {
        return res.status(400).json({
          success: false,
          message: "Security Error: The uploaded file is not a valid PDF binary document.",
        });
      }

      const uploadResult = await uploadFileToCloudinary(req.file.buffer, {
        resource_type: "image",
        folder: "v_kashyap_resources",
      });

      finalFileUrl = uploadResult.secure_url;
      finalPublicId = uploadResult.public_id;
      computedSize = formatBytes(uploadResult.bytes || req.file.size);
      computedPages = uploadResult.pages || 1;
    }

    if (!finalFileUrl && !finalPublicId) {
      return res.status(400).json({
        success: false,
        message: "Please select a PDF file to upload or provide a Cloudinary Public ID / File URL.",
      });
    }

    // If only public ID was provided
    if (!finalFileUrl && finalPublicId) {
      finalFileUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${finalPublicId}.pdf`;
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newResource = await Resource.create({
      id: req.body.id || slug || `resource-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle?.trim() || "",
      category: category?.trim() || "Safety & Wellbeing",
      summary: docSummary,
      description: docDescription,
      fileUrl: finalFileUrl,
      cloudinaryPublicId: finalPublicId || "",
      fileType: "pdf",
      fileSize: computedSize,
      pagesCount: computedPages,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "PDF uploaded to Cloudinary & saved to database successfully!",
      data: newResource,
    });
  } catch (error) {
    console.error("Error creating resource in database:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Update resource in MongoDB
 */
export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const resource = await Resource.findOne({
      $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    // If replacing file with a new PDF
    if (req.file) {
      const header = req.file.buffer.slice(0, 5).toString("utf-8");
      if (!header.startsWith("%PDF-")) {
        return res.status(400).json({
          success: false,
          message: "Security Error: The uploaded file is not a valid PDF binary document.",
        });
      }

      // Delete old asset if available
      if (resource.cloudinaryPublicId) {
        try {
          await deleteFromCloudinary(resource.cloudinaryPublicId, "image");
        } catch (delErr) {
          console.warn("Could not delete previous asset:", delErr.message);
        }
      }

      const uploadResult = await uploadFileToCloudinary(req.file.buffer, {
        resource_type: "image",
        folder: "v_kashyap_resources",
      });

      resource.fileUrl = uploadResult.secure_url;
      resource.cloudinaryPublicId = uploadResult.public_id;
      resource.fileSize = formatBytes(uploadResult.bytes || req.file.size);
      resource.pagesCount = uploadResult.pages || 1;
    }

    if (body.title !== undefined) resource.title = body.title.trim();
    if (body.summary !== undefined) resource.summary = body.summary.trim();
    if (body.description !== undefined) resource.description = body.description.trim();
    if (body.category !== undefined) resource.category = body.category.trim();
    if (body.fileUrl !== undefined && !req.file) resource.fileUrl = body.fileUrl.trim();
    if (body.cloudinaryPublicId !== undefined && !req.file) resource.cloudinaryPublicId = body.cloudinaryPublicId.trim();

    await resource.save();

    return res.status(200).json({
      success: true,
      message: "Resource updated successfully",
      data: resource,
    });
  } catch (error) {
    console.error("Error updating resource in database:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Delete resource from MongoDB and Cloudinary
 */
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findOneAndDelete({
      $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    // Cleanup Cloudinary asset if public ID is known
    if (resource.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(resource.cloudinaryPublicId, "image");
      } catch (err) {
        console.warn("Cloudinary asset deletion skipped or failed:", err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Resource and Cloudinary PDF deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting resource from database:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Stream/view the PDF document in browser directly from Cloudinary using authenticated backend stream
 */
export const viewResourcePdf = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID matches a Resource document, slug, or MongoDB _id
    const resource = await Resource.findOne({
      $or: [
        { id: id },
        { _id: id && id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { cloudinaryPublicId: id },
      ].filter(Boolean),
    }).lean();

    const publicId = resource?.cloudinaryPublicId || (id === "womens-safety-and-ocd-guide" ? "Women_s_Safety_and_OCD_Guide" : id);

    try {
      const authenticatedUrl = cloudinary.utils.private_download_url(publicId, "pdf", {
        resource_type: "image",
        type: "upload",
        expires_at: Math.floor(Date.now() / 1000) + 7200, // Valid for 2 hours
      });

      const pdfResponse = await axios.get(authenticatedUrl, {
        responseType: "stream",
        timeout: 15000,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${publicId}.pdf"`);
      return pdfResponse.data.pipe(res);
    } catch (cErr) {
      console.warn("Could not stream Cloudinary image PDF directly, attempting fallback:", cErr.message);

      // Fallback: try raw resource type if image type was not found
      try {
        const rawAuthUrl = cloudinary.utils.private_download_url(publicId, "pdf", {
          resource_type: "raw",
          type: "upload",
          expires_at: Math.floor(Date.now() / 1000) + 7200,
        });
        const rawResponse = await axios.get(rawAuthUrl, {
          responseType: "stream",
          timeout: 15000,
        });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${publicId}.pdf"`);
        return rawResponse.data.pipe(res);
      } catch (rawErr) {
        console.warn("Raw Cloudinary streaming failed, attempting direct stored URL:", rawErr.message);

        // Fallback: Direct fileUrl stored in DB
        if (resource?.fileUrl) {
          try {
            const directResponse = await axios.get(resource.fileUrl, {
              responseType: "stream",
              timeout: 15000,
            });
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `inline; filename="${publicId}.pdf"`);
            return directResponse.data.pipe(res);
          } catch (dErr) {
            console.error("Direct file URL failed:", dErr.message);
          }
        }

        console.error("All Cloudinary streaming attempts failed:", rawErr.message);
        return res.status(500).send("Unable to load document from storage");
      }
    }
  } catch (error) {
    console.error("Error streaming PDF:", error.message);
    return res.status(500).send("Unable to load document from storage");
  }
};
