import express from "express";
import {
  createFeatureRequest,
  getAllFeatureRequests,
  updateFeatureRequestStatus,
} from "../controllers/featureRequest.controller.js";
import { featureLimiter } from "../middleware/rateLimiter.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/suggest", featureLimiter, createFeatureRequest);
router.get("/requests", getAllFeatureRequests);
router.patch("/requests/:id", adminAuth, updateFeatureRequestStatus);

export default router;
