const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userBooksSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please enter a User"],
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    required: [true, "Please enter a Book"],
  },
  state: {
    type: String,
    enum: ["read", "is reading", "want to read"],
    default: "want to read",
    required: [true, "Please enter a State"],
  },
  rating: {
    type: Number,
  },
  review: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("UserBook", userBooksSchema);
