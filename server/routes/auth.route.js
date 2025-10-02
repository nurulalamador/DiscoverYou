const express = require("express");
const router = express.Router();

const { login, index, signup, logout } = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, index);
router.post("/login", login);
router.post("/signup", signup);
router.get("/logout", verifyToken, logout);

module.exports = router;