const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getAllHiring } = require("../controllers/hiring.controller");

router.get("/all", getAllHiring);


module.exports = router;