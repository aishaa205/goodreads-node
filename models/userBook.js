const mongoose = require("mongoose");

const userBooksSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Please enter a User"],
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: "book",
    required: [true, "Please enter a Book"],
  },
  state: {
    type: Number,
    required: [true, "Please enter a State"],
  },
  rating: {
    type: Number,
    required: [true, "Please enter Your rating"],
  },
  review: {
    type: String,
  },
});

module.exports = mongoose.model("UserBook", userBooksSchema);
