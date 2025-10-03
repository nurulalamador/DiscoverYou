const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getProfileImage } = require("../controllers/profile.controller");

router.get("/picture/:id", getProfileImage);

module.exports = router;