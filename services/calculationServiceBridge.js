// services/calculationServiceBridge.js
const CalculationService = require('./calculationService');

// instantiate once
const service = new CalculationService();
const windowTypes = service.initializeWindowTypes();

// Map frontend input to legacy type key
function resolveType(noOfPanels, fixedPartition) {
  // ADD DEBUG LOG HERE:
  console.log('🔍 Resolving type for:', { noOfPanels, fixedPartition });
  
  const typeMap = {
    '2-noPartition': 'type1',
    '2-fixedBottom': 'type2',
    '2-fixedTop': 'type2',
    '2-doubleFixed': 'type3',
    '3-noPartition': 'type4',
    '3-fixedBottom': 'type5',
    '3-fixedTop': 'type5', 
    '3-doubleFixed': 'type6',
    '4-noPartition': 'type7',
    '4-fixedBottom': 'type8',
    '4-fixedTop': 'type8',
    '4-doubleFixed': 'type9',
    // Add other mappings as needed
  };
  
  const key = `${noOfPanels}-${fixedPartition}`;
  const resolvedType = typeMap[key] || null;
  
  // ADD DEBUG LOG HERE:
  console.log('🔍 Mapping key:', key, '->', resolvedType);
  
  return resolvedType;
}

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
