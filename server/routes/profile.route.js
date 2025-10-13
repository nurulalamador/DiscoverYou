const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getProfileImage, addUserInterests, getProfile, toggleFollow } = require("../controllers/profile.controller");

router.get("/picture/:id", getProfileImage);
router.post("/setInterest", verifyToken, addUserInterests);
router.get("/:id", verifyToken, getProfile);
router.post("/toggleFollow", verifyToken, toggleFollow);

module.exports = router;