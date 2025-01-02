// src/services/guideAvailability.service.js
const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/appError');

const prisma = new PrismaClient();

class GuideAvailabilityService {
  async checkAvailability(guideId, startDate, endDate) {
    try {
      // Check existing tour assignments
      const existingTours = await prisma.tourSchedule.findMany({
        where: {
          guides: {
            some: { id: guideId }
          },
          AND: [
            { startDate: { lte: endDate } },
            { endDate: { gte: startDate } }
          ]
        }
      });

      if (existingTours.length > 0) {
        throw new AppError('Guide has existing tours during this period', 400);
      }

      // Check approved leaves
      const leaveRequest = await prisma.guideLeaveRequest.findFirst({
        where: {
          guideId,
          status: 'APPROVED',
          AND: [
            { startDate: { lte: endDate } },
            { endDate: { gte: startDate } }
          ]
        }
      });

      if (leaveRequest) {
        throw new AppError('Guide is on approved leave during this period', 400);
      }

      // Check blackout dates
      const blackoutDate = await prisma.guideBlackoutDates.findFirst({
        where: {
          guideId,
          date: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      if (blackoutDate) {
        throw new AppError('Guide has blackout dates during this period', 400);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async requestLeave(guideId, startDate, endDate, reason) {
    try {
      // First check if guide is available
      await this.checkAvailability(guideId, startDate, endDate);

      // Create leave request
      const leaveRequest = await prisma.guideLeaveRequest.create({
        data: {
          guideId,
          startDate,
          endDate,
          reason,
          status: 'PENDING'
        }
      });

      return leaveRequest;
    } catch (error) {
      throw error;
    }
  }

  async updateAvailabilityStatus(guideId, startDate, endDate, status) {
    try {
      const availabilitySchedule = await prisma.guideAvailabilitySchedule.create({
        data: {
          guideId,
          startDate,
          endDate,
          status
        }
      });

      return availabilitySchedule;
    } catch (error) {
      throw error;
    }
  }

  async getGuideSchedule(guideId, startDate, endDate) {
    try {
      const [tours, leaves, availability] = await Promise.all([
        // Get assigned tours
        prisma.tourSchedule.findMany({
          where: {
            guides: { some: { id: guideId } },
            startDate: { gte: startDate },
            endDate: { lte: endDate }
          },
          include: {
            tour: {
              select: {
                title: true,
                duration: true
              }
            }
          }
        }),
        // Get leave requests
        prisma.guideLeaveRequest.findMany({
          where: {
            guideId,
            startDate: { gte: startDate },
            endDate: { lte: endDate }
          }
        }),
        // Get availability schedule
        prisma.guideAvailabilitySchedule.findMany({
          where: {
            guideId,
            startDate: { gte: startDate },
            endDate: { lte: endDate }
          }
        })
      ]);

      return { tours, leaves, availability };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new GuideAvailabilityService();






