const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeedSchema = new Schema(
  {
    body: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feed", FeedSchema);
