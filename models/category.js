const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 2,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0, // Starts at 0 when a new document is created
      min: 0, // Ensures views cannot be negative
    },
  },
  { timestamps: true } //add timestamp for each document,
);

module.exports = mongoose.model("category", categorySchema);
