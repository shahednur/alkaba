const express = require('express');
const { 
  checkAvailability,
  requestLeave,
  updateAvailability,
  getGuideSchedule
} = require('../controllers/guideAvailability.controller');
// const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// router.use(protect); // Protect all routes

router
  .route('/check/:guideId')
  .post(checkAvailability);

router
  .route('/leave/:guideId')
  .post(requestLeave);

router
  .route('/status/:guideId')
  .patch(updateAvailability);

router
  .route('/schedule/:guideId')
  .get(getGuideSchedule);

module.exports = router;