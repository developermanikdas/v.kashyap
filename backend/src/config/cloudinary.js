import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a local file or buffer to Cloudinary
 */
export const uploadFileToCloudinary = async (filePathOrBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: options.resource_type || "auto",
      folder: options.folder || "v_kashyap_resources",
      ...options,
    };

    if (typeof filePathOrBuffer === "string") {
      cloudinary.uploader.upload(filePathOrBuffer, uploadOptions, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    } else {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      uploadStream.end(filePathOrBuffer);
    }
  });
};

/**
 * Delete a resource from Cloudinary by public ID
 */
export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error(`Error deleting Cloudinary asset ${publicId}:`, error);
    throw error;
  }
};

export default cloudinary;
