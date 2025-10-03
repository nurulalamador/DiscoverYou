const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getCourseImage, getAllCourses, getSingleCourse } = require("../controllers/course.controller");

router.get("/image/:id", getCourseImage);
router.get("/all/", verifyToken, getAllCourses);
router.get("/single/:id", getSingleCourse);

module.exports = router;