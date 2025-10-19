const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getAllContest, getAllWebinar, getAllUser, getAllCourse } = require("../controllers/admin.controller");

router.get("/contest", verifyToken, getAllContest);
router.get("/webinar", verifyToken, getAllWebinar);
router.get("/user", verifyToken, getAllUser);
router.get("/course", verifyToken, getAllCourse);


module.exports = router;