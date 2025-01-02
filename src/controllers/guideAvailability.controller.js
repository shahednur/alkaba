const GuideAvailabilityService = require('../services/guideAvailability.service');
const catchAsync = require('../utils/catchAsync');

exports.checkAvailability = catchAsync(async (req, res, next) => {
  const { guideId } = req.params;
  const { startDate, endDate } = req.body;

  const isAvailable = await GuideAvailabilityService.checkAvailability(
    guideId,
    new Date(startDate),
    new Date(endDate)
  );

  res.status(200).json({
    status: 'success',
    data: { isAvailable }
  });
});

exports.requestLeave = catchAsync(async (req, res, next) => {
  const { guideId } = req.params;
  const { startDate, endDate, reason } = req.body;

  const leaveRequest = await GuideAvailabilityService.requestLeave(
    guideId,
    new Date(startDate),
    new Date(endDate),
    reason
  );

  res.status(201).json({
    status: 'success',
    data: { leaveRequest }
  });
});

exports.updateAvailability = catchAsync(async (req, res, next) => {
  const { guideId } = req.params;
  const { startDate, endDate, status } = req.body;

  const availability = await GuideAvailabilityService.updateAvailabilityStatus(
    guideId,
    new Date(startDate),
    new Date(endDate),
    status
  );

  res.status(200).json({
    status: 'success',
    data: { availability }
  });
});

exports.getGuideSchedule = catchAsync(async (req, res, next) => {
  const { guideId } = req.params;
  const { startDate, endDate } = req.query;

  const schedule = await GuideAvailabilityService.getGuideSchedule(
    guideId,
    new Date(startDate),
    new Date(endDate)
  );

  res.status(200).json({
    status: 'success',
    data: { schedule }
  });
});