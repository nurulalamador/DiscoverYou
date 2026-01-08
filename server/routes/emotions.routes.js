// routes/emotions.routes.js
const router = require("express").Router();

const verifyToken = require("../middlewares/verifyToken");
const emotionsController = require("../controllers/emotions.controller");

router.post("/:experienceId", verifyToken, emotionsController.addEmotionEntry);

// Get emotion entries for an experience
// GET /api/emotions/:experienceId
router.get("/:experienceId", verifyToken, emotionsController.getEmotionEntries);

module.exports = router;
