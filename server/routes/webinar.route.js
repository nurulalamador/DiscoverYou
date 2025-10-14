const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getAllWebinar } = require("../controllers/webinar.controller");

router.get("/all", getAllWebinar);

module.exports = router;