
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    fName: {
      type: String,
      required: [true, "Please enter a first name"],
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
  
  userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  });


  module.exports = mongoose.model("user",userSchema);