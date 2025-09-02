// controllers/calculationController.js
const calculationService = require('../services/calculationServiceBridge.js');

// GET /api/calculations
exports.getCalculations = (req, res) => {
  const result = calculationService.getAll();
  res.json(result);
};

// POST /api/calculations
exports.createCalculation = (req, res) => {
  try {
    const { input } = req.body;   // assuming input structure matches old service
    const result = calculationService.calculate(input);

    res.json({ success: true, result });
  } catch (err) {
    console.error("❌ Calculation error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
