const Book = require("../models/book");
const User = require("../models/user");

const { cloudinary } = require("../cloudinary");
const { connect } = require("mongoose");

module.exports.index = async (req, res) => {
  const user = new User(req.user).populate("books");
  const books = await Book.find({}).populate("readers");
  res.render("books/index", { books, user });
};

module.exports.renderNewBookForm = (req, res) => {
  res.render("books/new");
};

module.exports.showSingleBook = async (req, res) => {
  const book = await Book.findById(req.params.id)
    .populate("readers")
    .populate({
      path: "reviews",
      populate: {
        path: "writer",
      },
    });
  if (!book) {
    req.flash("error", "Book not found");
    res.redirect("/books");
  }
  res.render("books/show", { book });
};

module.exports.addNewBook = async (req, res, next) => {
  const book = new Book(req.body.book);
  const user = new User(req.user);
  const bookExist = await Book.exists({ title: book.title });

  if (bookExist === true) {
    const foundBooks = await Book.find({ title: book.title });
    let foundBook = foundBooks[0];
    let isReading = user.books.includes(foundBook._id);

    if (!isReading) {
      user.books.push(foundBook._id);
      foundBook.readers.push(user);
      await foundBook.save();
      await user.save();

      req.flash(
        "success",
        `Successfully added: ${foundBook.title} to your library`
      );
      res.redirect(`/books/${foundBook._id}`);
    } else if (isReading) {
      req.flash("error", `You are already reading that!`);
      res.redirect(`/books/${foundBook._id}`);
    }
  } else {
    user.books.push(book);
    book.readers.push(user);
    await book.save();
    await user.save();

    req.flash("success", `Successfully submitted a new book: ${book.title}`);
    res.redirect(`/books/${book._id}`);
  }
};

module.exports.renderEditBookForm = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    req.flash("error", "Book not found");
    res.redirect("/books");
  }
  res.render("books/edit", { book });
};

module.exports.editBook = async (req, res) => {
  const { id } = req.params;
  const book = await Book.findByIdAndUpdate(id, {
    ...req.body.book,
  });
  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  book.images.push(...images);
  await book.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await book.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully made an update");
  res.redirect(`/books/${id}`);
};

module.exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  await Book.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted");
  res.redirect(`/books/`);
};
