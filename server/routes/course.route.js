const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getCourseImage, getAllCourses, getSingleCourse, getMaterial } = require("../controllers/course.controller");

router.get("/image/:id", getCourseImage);
router.get("/material/:id", getMaterial);
router.get("/all/", verifyToken, getAllCourses);
router.get("/single/:id", verifyToken, getSingleCourse);

module.exports = router;