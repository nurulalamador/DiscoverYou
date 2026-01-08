const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getProfileImage, addUserInterests, getProfile, toggleFollow, getInitialData, getLeaderboard, getHomeData, getNotifications, getSearchData } = require("../controllers/profile.controller");

router.get("/picture/:id", getProfileImage);
router.post("/setInterest", verifyToken, addUserInterests);
router.post("/toggleFollow", verifyToken, toggleFollow);
router.get("/initialData", verifyToken, getInitialData);
router.get("/leaderboard", getLeaderboard);
router.get("/homepage", verifyToken, getHomeData);
router.get("/notification", verifyToken, getNotifications)
router.post("/search", verifyToken, getSearchData);
router.get("/:id", verifyToken, getProfile);

module.exports = router;