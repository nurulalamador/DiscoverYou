const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getAllCommunities, getCommunityMessages, sendMessage, joinCommunity } = require("../controllers/community.controller");

router.get("/all", verifyToken, getAllCommunities);
router.get("/inbox/:id", verifyToken, getCommunityMessages);
router.post("/send", verifyToken, sendMessage);
router.post("/join", verifyToken, joinCommunity);


module.exports = router;