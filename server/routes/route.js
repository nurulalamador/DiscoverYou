const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.route");
const courseRoutes = require("./course.route");
const profileRoutes = require("./profile.route");
const showcaseRoutes = require("./showcase.route");
const messagingRoutes = require("./messaging.route");
const hiringRoutes = require("./hiring.route");
const contestRoutes = require("./contest.route");
const webinarRoutes = require("./webinar.route");

router.use("/auth", authRoutes);
router.use("/course", courseRoutes);
router.use("/profile", profileRoutes);
router.use("/showcase", showcaseRoutes);
router.use("/contest", contestRoutes);
router.use("/webinar", webinarRoutes);
router.use("/messaging", messagingRoutes);
router.use("/hiring", hiringRoutes);

module.exports = router;