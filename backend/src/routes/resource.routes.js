import express from "express";
import {
  getAllResources,
  getResourceByIdOrSlug,
  viewResourcePdf,
} from "../controllers/resource.controller.js";

const router = express.Router();

// Public Resource Endpoints
router.get("/", getAllResources);
router.get("/:id", getResourceByIdOrSlug);
router.get("/:id/view", viewResourcePdf);

export default router;
