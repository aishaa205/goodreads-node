const User = require("../models/user");
const bcrypt = require("bcrypt");

const createAdminUser = async () => {
  try {
    const existingUser = await User.findOne({ email: "admin@example.com" });
    if (existingUser) {
      console.log("Admin account already exist");
    } else {
      const newUser = new User({
        fName: "Admin",
        lName: "Admin",
        username: "Admin",
        email: "admin@example.com",
        role: "admin",
        password: await bcrypt.hash("password-admin", 10),
        emailVerified: true,
      });

      await newUser.save();
      console.log("Admin account created successfully");
    }
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = { createAdminUser };
