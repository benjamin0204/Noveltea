const Book = require("../models/book");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxtoken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxtoken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const books = await Book.find({});
  res.render("books/index", { books });
};

module.exports.renderNewBookForm = (req, res) => {
  res.render("books/new");
};

module.exports.showSingleBook = async (req, res) => {
  const book = await Book.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!book) {
    req.flash("error", "Book not found");
    res.redirect("/books");
  }
  res.render("books/show", { book });
};

module.exports.createNewBook = async (req, res, next) => {
  const book = new Book(req.body.book);

  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.book.location,
      limit: 1,
    })
    .send();
  book.geometry = geoData.body.features[0].geometry;
  book.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  book.author = req.user._id;
  await book.save();
  console.log(book);
  req.flash("success", `Successfully submitted a new book: ${book.title}`);
  res.redirect(`/books/${book._id}`);
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
  console.log(req.body);
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
