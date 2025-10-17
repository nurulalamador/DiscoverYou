const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getAllWebinar, getSingleWebinar, toggleRegister, getPreviousWebinar } = require("../controllers/webinar.controller");

router.get("/all", getAllWebinar);
router.get("/previous", getPreviousWebinar);
router.get("/single/:id", verifyToken, getSingleWebinar);
router.post("/toggleRegister", verifyToken, toggleRegister);

module.exports = router;