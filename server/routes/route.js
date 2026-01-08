const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.route");
const profileRoutes = require("./profile.route");
const feedRoutes = require("./feed.route");
const experienceRoutes = require("./experiences.routes");
const emotionsRoute = require("./emotions.routes");
const therapistRoutes = require("./therapist.route");

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/feed", feedRoutes);
router.use("/experiences", experienceRoutes);
router.use("/emotions", emotionsRoute);
router.use("/therapist", therapistRoutes);

module.exports = router;