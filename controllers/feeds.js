const Book = require("../models/book");
const User = require("../models/user");
const Feed = require("../models/feed");
const Comment = require("../models/comment");
const Notification = require("../models/notification");

module.exports.renderFeed = async (req, res) => {
  const users = await User.find({}).limit(5).sort({ createdAt: -1 });
  const feedMessages = await Feed.find({})
    .sort({ createdAt: "desc" })
    .populate("reader")
    .populate({
      path: "comments",
      populate: { path: "author" },
    });

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
module.exports.addComment = async (req, res) => {
  let comment = new Comment();
  let notification = new Notification();

  let feed = await Feed.findById(req.params.feedId);
  let commentAuthor = await User.findById(req.user._id); // user who wrote comment
  let feedAuthor = await User.findById(feed.reader); // user who made the original message

  comment.author = commentAuthor;
  comment.body = req.body.comment;

  notification.sender = commentAuthor;
  notification.reciever = feedAuthor;
  notification.body = comment.body;
  notification.read = false;
  notification.feedMessage = feed;

  feed.comments.push(comment);

  await comment.save();
  await feed.save();
  await notification.save();

  res.redirect("/feed");
};
