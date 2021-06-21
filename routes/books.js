const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateBook, isAuthor } = require("../middleware");
const books = require("../controllers/books");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// Prefixed with /books

router
  .route("/")
  .get(isLoggedIn, catchAsync(books.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateBook,
    catchAsync(books.addNewBook)
  );

router.get("/new", isLoggedIn, books.renderNewBookForm);

router
  .route("/:id")
  .get(isLoggedIn, catchAsync(books.showSingleBook))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateBook,
    catchAsync(books.editBook)
  )
  .delete(isLoggedIn, catchAsync(books.deleteBook));

router.get("/:id/edit", isLoggedIn, catchAsync(books.renderEditBookForm));

module.exports = router;
