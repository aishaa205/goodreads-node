const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;
const authorsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
      unique: true,
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
      default: "https://imgur.com/BYwiZv4",
    },
    views: {
      type: Number,
      default: 0, // Starts at 0 when a new document is created
    },
  },
  { timestamps: true } //
);
module.exports = mongoose.model("author", authorsSchema);
