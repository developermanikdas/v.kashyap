import express from "express";
import protect from "../middleware/auth.js";
import { getRandomQuote } from "../controllers/quote.controller.js";

const router = express.Router();

// Apply auth protection middleware to all quote routes
router.use(protect);

router.get("/random", getRandomQuote);

export default router;
