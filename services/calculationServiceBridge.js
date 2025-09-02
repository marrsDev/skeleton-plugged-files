// services/calculationService.js
const { createCalculator } = require('./calculationService.js');

// Instantiate the calculator engine once
const calculator = createCalculator();

module.exports = {
  // expose just what the controller needs
  calculate: calculator.calculate,

  // stub for history/listing support (expand later if needed)
  getAll: () => []
};
