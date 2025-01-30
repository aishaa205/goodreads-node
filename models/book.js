const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const booksSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter a Title"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Please enter a Category"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "auhtor",
      required: [true, "Please enter an Auhtor"],
    },
    description: {
      type: String,
      required: [true, "Please enter a Description"],
    },
    img: {
      type: String,
    },
    views: {
      type: Number,
      default: 0, // Starts at 0 when a new document is created
      min: 0, // Ensures views cannot be negative
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", booksSchema);
