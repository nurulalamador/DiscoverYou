const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.route");
const courseRoutes = require("./course.route");

router.use("/auth", authRoutes);
router.use("/course", courseRoutes)

module.exports = router;