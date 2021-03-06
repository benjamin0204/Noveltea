const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeedSchema = new Schema(
  {
    body: [String],
    reader: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
    likes: Number,
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Feed", FeedSchema);
