const userBook = require("../models/userBook");
// const User = require('../models/user');
// const Book = require('../models/book');

exports.createUserBook = async (req, res) => {
  try {
    console.log("test");
    const newUserBook = new userBook(req.body);
    const existingUserBook = await userBook.findOne({
      user: req.body.user,
      book: req.body.book,
    });
    console.log(existingUserBook);
    if (existingUserBook) {
      return res.status(400).json({ message: "UserBook already exists" });
    }
    await newUserBook.save();
    res.status(201).send(newUserBook);
  } catch (error) {
    console.log(error);
    res.status(400).send("error");
  }
};
exports.getBooksForUser = async (req, res) => {
  try {
    const userBooks = await userBook
      .find({ user: req.params.userId }) // Filter by user ID
      .populate("book"); // Populate book details

    if (!userBooks || userBooks.length === 0) {
      return res.status(404).json({ message: "No books found for this user" });
    }

    res.json(userBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserBooks = async (req, res) => {
  try {
    const userBook = await userBookModel
      .find({ user: req.params.id }, "_id rating review state ")
      .populate("user", "name")
      .populate({
        path: "book",
        select: "title img",
        populate: { path: "author", select: "name" },
      });

    if (!userBook || userBook.length === 0) {
      return res.status(404).send({ message: "No books found for this user." });
    }

    res.send(userBook);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getUserBook = async (req, res) => {
  try {
    const userBookData = await userBook
      .findById(req.params.id)
      .populate("user")
      .populate("book");
    if (!userBookData) {
      return res.status(404).send();
    }
    res.send(userBookData);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateUserBook = async (req, res) => {
  try {
    const userBook = await userBook.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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
