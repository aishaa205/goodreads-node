const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const booksSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please enter a Title"],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "category",
    required: [true, "Please enter a Category"],
  },
  auhtor: {
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
  created_at: {
    type: Date,
  },
});

module.exports = mongoose.model("Books",booksSchema);