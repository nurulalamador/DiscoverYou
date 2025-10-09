const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.route");
const courseRoutes = require("./course.route");
const profileRoutes = require("./profile.route");
const showcaseRoutes = require("./showcase.route");
const messagingRoutes = require("./messaging.route");

router.use("/auth", authRoutes);
router.use("/course", courseRoutes);
router.use("/profile", profileRoutes);
router.use("/showcase", showcaseRoutes);
router.use("/messaging", messagingRoutes);

module.exports = router;