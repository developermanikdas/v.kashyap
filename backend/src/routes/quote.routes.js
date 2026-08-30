import express from "express";
import {
  getRandomQuote,
  getDailyQuote,
  getAllQuotes,
  getQuoteById,
} from "../controllers/quote.controller.js";

const router = express.Router();

// Public Quote Retrieval Endpoints
router.get("/random", getRandomQuote);
router.get("/daily", getDailyQuote);
router.get("/", getAllQuotes);
router.get("/:id", getQuoteById);

export default router;
