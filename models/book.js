const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: String,
  sub: String,
  image: String,
  author: String,
  publisher: String,
  pubDate: Date,
  desc: String,
  pageCount: Number,
  genre: String,
  bookLink: String,
  readers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = mongoose.model("Book", BookSchema);
