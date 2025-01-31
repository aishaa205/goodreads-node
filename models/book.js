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
      ref: "author",
      required: [true, "Please enter an Auhtor"],
    },
    description: {
      type: String,
      required: [true, "Please enter a Description"],
    },
    img: {
      type: String,
    },
    url: {
      type: String,
      validate: {
        validator: function (value) {
          return /^(http|https):\/\/[^ "]+$/.test(value);
        },
        message: "Invalid book URL format.",
      },
    },
    totalRate: {
      type: Number,
      default: 0,
    },
    totalRateCount: {
      type: Number,
      default: 0,
    },
    edition: {
      type: Number,
      required: [true, "Please enter an Edition"],
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
