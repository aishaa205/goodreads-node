const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



exports.registerUser = async (req, res) => { // register 
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).send({ message: "User created successfully", user });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };


  exports.getUsers = async (req, res) => { 
    try {
      const users = await User.find();
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };


  exports.loginUser = async (req, res) => { // login 
    try {
      const { email, password } = req.body; 

      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).send({ message: "User not found" });
      }
      //by compare el pass ely el user da5alo b el hash pass
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).send({ message: "Invalid credentials" });
      }  
      const token = jwt.sign(
          { _id: user._id }, 
          process.env.ACCESS_TOKEN_SECRET, 
          { expiresIn: "1h" } // ba3d 1 hour byro7
      );

      res.status(200).send({ message: "Login successful", token, user });
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
  };

  
  exports.updateUser = async (req, res) => {
    try {
      const updates = req.body;
      if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
      }
      const user = await User.findByIdAndUpdate(req.params.id, updates, {
        new: true,
      });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send(user);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };
  


  // exports.deleteUser = async (req, res) => {
  //   try {
  //     const user = await User.findByIdAndDelete(req.params.id);
  //     if (!user) {
  //       return res.status(404).send({ message: "User not found" });
  //     }
  //     res.status(200).send({ message: "User deleted successfully" });
  //   } catch (error) {
  //     res.status(500).send({ error: error.message });
  //   }
  // };


  