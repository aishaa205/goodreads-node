const mongoose = require("mongoose");

const { Schema } = mongoose;

const adminSchema = new Schema({
  _id: {
    type: Number,
    min: 0,
  },
  username: {
    type: String,
    required: [true, "Please enter an username"],
    unique: true,
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
});

const Admin = mongoose.model("Admin", adminSchema); //Admin is name of the MongoDB collection,
//  By default, Mongoose converts the model name to its plural, lowercase form (e.g., "Admin" becomes admins), unless otherwise configured.

module.exports = Admin;
