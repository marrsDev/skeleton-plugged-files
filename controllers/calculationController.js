// controllers/calculationController.js
const { calculateWindowCost } = require('../services/calculationServiceBridge.js');

// GET /api/calculations
exports.getCalculations = (req, res) => {
  const result = calculationService.getAll();
  res.json(result);
};

// POST /api/calculations
exports.createCalculation = async (req, res) => {
  try {
    const input = req.body;
    const calculationResult = await calculateWindowCost(input);

    // Return just the result part without the extra nesting
    res.json({
      success: true,
      ...calculationResult  // Spread the result properties directly
    });
  } catch (err) {
    console.error("❌ Calculation error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
