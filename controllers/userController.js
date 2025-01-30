const User = require('../models/user');
const bcrypt = require("bcryptjs");



exports.createUser = async (req, res) => {
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


  exports.getUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send(user);
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
  


  exports.deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };


//   exports.loginUser = async (req, res) => {

//     const username = req.body.username
//     const user ={name:username}
    
    
//   };
