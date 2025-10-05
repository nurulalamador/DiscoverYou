const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { addPost } = require("../controllers/showcase.controller");

router.post("/addPost", verifyToken, addPost);

module.exports = router;