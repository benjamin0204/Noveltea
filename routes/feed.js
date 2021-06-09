const express = require("express");
const router = express.Router();
const { isLoggedIn, validateBook, isAuthor } = require("../middleware");
const feeds = require("../controllers/feeds");

// Prefixed with /

router.get("/", isLoggedIn, feeds.renderFeed);

module.exports = router;
