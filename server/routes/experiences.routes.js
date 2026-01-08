// routes/experiences.route.js
const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");

const exp = require("../controllers/experiences.controller");
const emo = require("../controllers/emotions.controller");
const ass = require("../controllers/assessments.controller");

// experiences
router.post("/", verifyToken, exp.createExperience);
router.get("/mine", verifyToken, exp.getMyExperiences);
router.get("/:id", verifyToken, exp.getExperienceById);

// emotions (Feature 1)
router.post("/:id/emotions", verifyToken, emo.addEmotionEntry);
router.get("/:id/emotions", verifyToken, emo.getEmotionEntries);

// assessments (Feature 2)
router.post("/:id/assessments", verifyToken, ass.createAssessment);
router.get("/:id/assessments", verifyToken, ass.getAssessments);

module.exports = router;
