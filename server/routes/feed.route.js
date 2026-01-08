// routes/feed.route.js
const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const feed = require("../controllers/feed.controller");

// public feed browsing
router.get("/", feed.getPublicFeed);
router.get("/:id", feed.getPublicExperience);

// learning signal (requires login for best tracking; but can still work without token if you remove verifyToken)
router.post("/:id/view", verifyToken, feed.logView);

module.exports = router;
