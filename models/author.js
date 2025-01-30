const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorsSchema = new Schema(
  {
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
      default: "http://localhost:3001/views/images/defaultPP.jpg",
    },
    books: [
      {
        type: Schema.Types.ObjectId,
        ref: "book",
      },
    ],
    views: {
      type: Number,
      default: 0, // Starts at 0 when a new document is created
      min: 0, // Ensures views cannot be negative
    }
  },
  { timestamps: true }//
);
module.exports = mongoose.model("Author", authorsSchema);
