const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const {
  getAllContest,
  getAllWebinar,
  getAllUser,
  getAllCourse,
  getDashboardStats,
  getUserGrowth,
  getPlatformActivity,
  getTopCommunities,
  getCoursePerformance,
  getCategoryDistribution,
  getEngagementMetrics,
  getRecentActivity,
  getRevenueAnalytics,
  getUserDemographics,
} = require("../controllers/admin.controller");

router.get("/contest", verifyToken, getAllContest);
router.get("/webinar", verifyToken, getAllWebinar);
router.get("/user", verifyToken, getAllUser);
router.get("/course", verifyToken, getAllCourse);

router.get("/stats", getDashboardStats);
router.get("/user-growth", getUserGrowth);
router.get("/platform-activity", getPlatformActivity);
router.get("/top-communities", getTopCommunities);
router.get("/course-performance", getCoursePerformance);
router.get("/category-distribution", getCategoryDistribution);
router.get("/engagement-metrics", getEngagementMetrics);
router.get("/recent-activity", getRecentActivity);
router.get("/revenue-analytics", getRevenueAnalytics);
router.get("/user-demographics", getUserDemographics);

module.exports = router;
