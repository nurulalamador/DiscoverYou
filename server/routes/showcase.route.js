const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { addPost, uploadMiddleware, getPostMedia, getAllPosts, togglePostReaction, getSinglePost } = require("../controllers/showcase.controller");

router.get("/posts", verifyToken, getAllPosts);
router.get("/post/:id", verifyToken, getSinglePost);
router.post("/addPost", verifyToken, uploadMiddleware, addPost);
router.get("/media/:id", getPostMedia);
router.post("/toggleLike", verifyToken, togglePostReaction);


module.exports = router;