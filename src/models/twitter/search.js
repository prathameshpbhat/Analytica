const mongoose = require("mongoose");
const { Schema } = mongoose;

const searchSchema = new Schema(
  {
    Author: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    status: {
      type: Number,
      required: true,
    },
    query: {
      type: String,
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

const Search = mongoose.model("twitter_searches", searchSchema);

module.exports = Search;
