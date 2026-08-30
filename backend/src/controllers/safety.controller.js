import SafetyScenario from "../models/SafetyScenario.js";

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const getAllSafetyScenarios = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category && category !== "all") {
      query.categoryId = category;
    }

    if (search && search.trim()) {
      const escaped = escapeRegex(search.trim());
      const regex = new RegExp(escaped, "i");
      query.$or = [
        { title: regex },
        { summary: regex },
        { overview: regex },
        { category: regex },
      ];
    }

    const scenarios = await SafetyScenario.find(query).sort({ num: 1 });
    return res.status(200).json({
      success: true,
      count: scenarios.length,
      data: scenarios,
    });
  } catch (error) {
    console.error("Error fetching safety scenarios:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching safety scenarios",
    });
  }
};

export const getSafetyScenarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const scenario = await SafetyScenario.findOne({ id });

    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: "Safety scenario not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: scenario,
    });
  } catch (error) {
    console.error("Error fetching safety scenario:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching safety scenario",
    });
  }
};
