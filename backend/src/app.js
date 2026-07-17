import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import quoteRoutes from "./routes/quote.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running 🚀",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/quotes", quoteRoutes);

export default app;