import express from "express";
import {
  getAllAcknowledgements,
  createAcknowledgement,
} from "../controllers/acknowledgement.controller.js";
import { publicPostLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/", getAllAcknowledgements);
router.post("/", publicPostLimiter, createAcknowledgement);

export default router;
