const Book = require("../models/book");
const User = require("../models/user");
const Feed = require("../models/feed");

module.exports.renderFeed = async (req, res) => {
  const users = await User.find({}).limit(5).sort({ createdAt: -1 });
  const feedMessages = await Feed.find({});
  const books = await Book.find({})
    .populate({
      path: "readers",
      options: { limit: 5 },
      populate: { path: "readers" },
    })
    .populate({
      path: "reviews",
      options: { limit: 1 },
      populate: {
        path: "writer",
      },
    })
    .limit(3)
    .sort({ createdAt: 1 });
  res.render("feed", { books, users, feedMessages });
};
