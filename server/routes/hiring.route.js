const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getAllHiring, getSingleHiring } = require("../controllers/hiring.controller");

router.get("/all", getAllHiring);
router.get("/single/:id", getSingleHiring);


module.exports = router;