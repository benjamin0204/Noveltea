const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const BookSchema = new Schema(
  {
    title: String,
    image: String,
    price: Number,
    desc: String,
    location: String,
    reader: [
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
  },
  opts
);

BookSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <strong><a href='/books/${this._id}'>${this.title}</a></strong>
  <p>${this.desc.substring(0, 20)}...</p>
  `;
});

BookSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Book", BookSchema);
