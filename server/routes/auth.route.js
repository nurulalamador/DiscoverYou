const express = require("express");
const router = express.Router();

const { login, index } = require("../controllers/auth.controller");

router.get("/", index);
router.get("/login", login);

module.exports = router;