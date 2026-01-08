// routes/therapist.route.js
const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const therapist = require("../controllers/therapist.controller");

router.post("/experiences/:id/note", verifyToken, therapist.addTherapistNote);

module.exports = router;
