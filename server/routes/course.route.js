const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getCourseImage, getAllCourses } = require("../controllers/course.controller");

router.get("/image/:id", getCourseImage);
router.get("/all/", getAllCourses);

module.exports = router;