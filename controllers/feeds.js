const Book = require("../models/book");
const User = require("../models/user");

module.exports.renderFeed = async (req, res) => {
  const users = await User.find({});
  const books = await Book.find({})
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  res.render("feed", { books, users });
};
