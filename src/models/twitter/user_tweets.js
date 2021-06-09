const mongoose = require("mongoose");
const { Schema } = mongoose;

const userTweetSchema = new Schema(
  {
    Author: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    status: {
      type: Number,
      required: true,
    },
    results: {
      type: Array,
    },
    count: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const UserTweet = mongoose.model("user_tweets", userTweetSchema);

module.exports = UserTweet;
