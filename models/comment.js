const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    body: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
