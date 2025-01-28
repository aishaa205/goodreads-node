const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorsSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },
  DOB: {
    type: Date,
  },
  about: {
    type: String,
    required: [true, "Please enter some information about you"],
  },
  img: {
    type: String,
  },
  books: [
    {
      type: Schema.Types.ObjectId,
      ref: "book",
    },
  ],
});
module.exports = mongoose.model("Author", authorsSchema);
