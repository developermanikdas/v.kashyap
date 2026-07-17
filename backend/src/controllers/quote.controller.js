import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const quotesPath = path.join(__dirname, "../data/quotes.json");
const quotes = JSON.parse(fs.readFileSync(quotesPath, "utf-8"));

export const getRandomQuote = async (req, res) => {
  try {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    return res.status(200).json({
      success: true,
      quote: randomQuote,
    });
  } catch (error) {
    console.error("Failed to fetch quote:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
