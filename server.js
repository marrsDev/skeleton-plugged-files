//server.js

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// --- Route inspector utility ---
function logRouteStatus(name, router) {
  if (router && router.stack && router.stack.length > 0) {
    console.log(`✅ Route "${name}" loaded with ${router.stack.length} handlers.`);
  } else {
    console.warn(`⚠️ Route "${name}" is empty or not mounted properly.`);
  }
}

// Import routes
const calculationRoutes = require('./routes/api/calculationRoutes');
const cartRoutes = require('./routes/api/cartRoutes');
const pricingRoutes = require('./routes/api/pricingRoutes');
const previewRoutes = require('./routes/api/previewRoutes');

// Mount routes
app.use('/api/calculations', calculationRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/preview', previewRoutes);

// Log route statuses
logRouteStatus('/api/calculations', calculationRoutes);
logRouteStatus('/api/cart', cartRoutes);
logRouteStatus('/api/pricing', pricingRoutes);
logRouteStatus('/api/preview', previewRoutes);

// --- Check Express router stack ---
if (app._router && app._router.stack.length > 0) {
  console.log(`✅ Express app has ${app._router.stack.length} middleware/routes mounted.`);
} else {
  console.warn('⚠️ Express app has no routes mounted.');
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
