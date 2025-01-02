const express = require('express');
const app = express();
const guideAvailabilityRoutes = require('./routes/guideAvailability.routes')

// Middleware and routes setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use('/api', require('./routes')); // Example route setup
app.use('/api/v1/guide-availability', guideAvailabilityRoutes);

module.exports = app; // Export the app instance
