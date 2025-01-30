const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
      minlength: [3, "Category name must be at least 3 characters long."],
      maxlength: [50, "Category name must not exceed 50 characters."],
      trim: true,
      unique: [true, "Category name already exists"] // Ensures unique category names
    },
    description: {
      type: String,
      maxlength: [200, "Description must not exceed 200 characters."],
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: (value) => {
          return value.startsWith("http://") || value.startsWith("https://");
        },
        message: "Invalid image URL format.",
      },
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
