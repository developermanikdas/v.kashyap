import express from "express";
import {
  getAllSafetyScenarios,
  getSafetyScenarioById
} from "../controllers/safety.controller.js";

const router = express.Router();

router.get("/", getAllSafetyScenarios);
router.get("/:id", getSafetyScenarioById);

export default router;
