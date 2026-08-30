import mongoose from "mongoose";

const verbalScriptSchema = new mongoose.Schema({
  quote: { type: String, required: true },
  caption: { type: String, default: "" }
}, { _id: false });

const escalationStepSchema = new mongoose.Schema({
  stage: { type: String, required: true },
  text: { type: String, required: true }
}, { _id: false });

const safetyScenarioSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    num: { type: String, required: true },
    category: { type: String, required: true },
    categoryId: { type: String, required: true, index: true },
    riskLevel: { type: String, required: true },
    riskBadge: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    overview: { type: String, required: true },
    assessmentCriteria: [{ type: String }],
    verbalScripts: [verbalScriptSchema],
    prohibitedActions: [{ type: String }],
    escalationSteps: [escalationStepSchema],
  },
  { timestamps: true }
);

const SafetyScenario = mongoose.model("SafetyScenario", safetyScenarioSchema);

export default SafetyScenario;
