const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getCourseImage, getAllCourses, getSingleCourse, getMaterial, enrollInCourse } = require("../controllers/course.controller");

router.get("/image/:id", getCourseImage);
router.get("/material/:courseId/:materialId/:userId", getMaterial);
router.get("/all/", verifyToken, getAllCourses);
router.get("/single/:id", verifyToken, getSingleCourse);
router.post("/enroll", verifyToken, enrollInCourse);

module.exports = router;