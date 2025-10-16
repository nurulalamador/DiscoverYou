const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getAllHiring, getSingleHiring, toggleApply, getPendingHiring } = require("../controllers/hiring.controller");

router.get("/all", verifyToken, getAllHiring);
router.get("/pending", verifyToken, getPendingHiring);
router.get("/single/:id", verifyToken, getSingleHiring);
router.post("/toggleApply", verifyToken, toggleApply);


module.exports = router;