const express = require("express");
const router = express.Router();

const { login } = require("../controllers/auth.controller");

router.get("/login", login);

module.exports = router;