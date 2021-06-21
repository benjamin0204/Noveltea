const express = require("express");
const router = express.Router();
const { isLoggedIn, validateBook, isAuthor } = require("../middleware");
const feeds = require("../controllers/feeds");

// Prefixed with /feed

router.get("/", isLoggedIn, feeds.renderFeed);

router.post("/:feedId/comment", isLoggedIn, feeds.addComment);

module.exports = router;
