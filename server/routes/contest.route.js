const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getAllContest, getPreviousContest, getSingleContest, toggleRegister, uploadContestMedia } = require("../controllers/contest.controller");

router.get("/all", getAllContest);
router.get("/previous", getPreviousContest);
router.get("/single/:id", verifyToken, getSingleContest);
router.post("/toggleRegister", verifyToken, toggleRegister);
router.post("/uploadSubmission", verifyToken, uploadContestMedia);


module.exports = router;