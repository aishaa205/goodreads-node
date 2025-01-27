const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  fName: {
    type: String,
    required: [true, "Please enter a first name"],//If omitted, an error message ("Please enter a username") will be thrown.
  },
  lName: {
    type: String,
    required: [true, "Please enter a last name"],
  },
  username: {
    type: String,
    required: [true, "Please enter a user name"],
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: 8,
  },
  img: {
    type: String,
  },
  created_at: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;