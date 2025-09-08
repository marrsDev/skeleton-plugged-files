async function calculateWindowCost(input) {
  // ADD DEBUG LOG HERE:
  console.log('📥 Input received:', input);
  
  const { height, width, noOfPanels, fixedPartition } = input;
  const typeKey = resolveType(noOfPanels, fixedPartition);
  
  // ADD DEBUG LOG HERE:
  console.log('🔑 Resolved type key:', typeKey);
  console.log('📋 Available window types:', Object.keys(windowTypes));

  if (!typeKey || !windowTypes[typeKey]) {
    throw new Error(`Unsupported window configuration: panels=${noOfPanels}, partition=${fixedPartition}`);
  }

  // Use the calculator directly from windowTypes
  const calculator = windowTypes[typeKey];
  
  // ADD DEBUG: Check what calculator contains
  console.log('🧮 Calculator type:', typeof calculator);

  const result = calculator.calculate(height, width);

  // ADD DEBUG LOG HERE (optional):
  console.log('✅ Calculation successful');

  return {
    breakdown: result,
    totals: result.totals?.(),
    installation: result.installation?.(),
    totalCost: result.totalCost?.()
  };
}

module.exports = { calculateWindowCost };
