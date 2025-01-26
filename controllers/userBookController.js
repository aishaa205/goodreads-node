const userBook = require('../models/userBook');
// const User = require('../models/user');
// const Book = require('../models/book');


exports.createUserBook = async (req, res) => {
  try {
    const userBook = new userBook(req.body);
    await userBook.save();

    res.status(201).send(userBook);
  } catch (error) {
    res.status(400).send(error);
  }
};



exports.getUserBooks = async (req, res) => {
  try {
    const userBooks = await userBook.find().populate('user').populate('book');
    res.status(200).send(userBooks);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getUserBook = async (req, res) => {
  try {
    const userBook = await userBook.findById(req.params.id).populate('user').populate('book');
    if (!userBook) {
      return res.status(404).send();
    }
    res.send(userBook);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateUserBook = async (req, res) => {
  try {
    const userBook = await userBook.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!userBook) {
      return res.status(404).send();
    }
    res.send(userBook);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteUserBook = async (req, res) => {
  try {
    const userBook = await userBook.findByIdAndDelete(req.params.id);
    if (!userBook) {
      return res.status(404).send();
    }
    res.send(userBook);
  } catch (error) {
    res.status(500).send(error);
  }
};