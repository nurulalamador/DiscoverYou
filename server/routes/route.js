const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.route");
const courseRoutes = require("./course.route");
const profileRoutes = require("./profile.route");

router.use("/auth", authRoutes);
router.use("/course", courseRoutes);
router.use("/profile", profileRoutes);

module.exports = router;