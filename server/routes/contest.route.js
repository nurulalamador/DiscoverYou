const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getAllContest } = require("../controllers/contest.controller");

router.get("/all", getAllContest);

module.exports = router;