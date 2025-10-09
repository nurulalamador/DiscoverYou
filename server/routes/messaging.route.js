const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getInboxMessages, getSingleMessages, sendMessage } = require("../controllers/messaging.controller");

router.get("/inbox", verifyToken, getInboxMessages);
router.get("/inbox/:id", verifyToken, getSingleMessages);
router.post("/send", verifyToken, sendMessage);


module.exports = router;