const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reciever: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    feedMessage: {
      type: Schema.Types.ObjectId,
      ref: "Feed",
    },
    body: String,
    read: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
