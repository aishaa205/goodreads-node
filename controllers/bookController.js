const author = require('../models/author');
const Book = require('../models/book');
const Category = require("../models/category");
const mongoose = require("mongoose");
 

// ana momken 23mel create , get ,update ,delete, w fe get by id 

exports.createBook = async (req, res) => {
  try {
    const existingBook = await Book.findOne({ title, author, edition });

    if (existingBook) {
      return res.status(400).json({ success: false, message: "Book already exists." });
    }
    const book = new Book(req.body);
    await book.save();

    res.status(201).json({ success: true, book });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('category', 'name').populate('author', 'name');
    res.status(200).send(books);
  } catch (error) {
    res.status(500).send(error);
  }
};


exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send();
    }
    res.send(book);
  } catch (error) {
    res.status(500).send(error);
  }
};

  exports.updateBook = async (req, res) => {
    try {
      const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!book) {
        return res.status(404).send();
      }
      res.send(book);
    } catch (error) {
      res.status(400).send(error);
    }
  };


  exports.deleteBook = async (req, res) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        return res.status(404).send();
      }
      res.send(book);
    } catch (error) {
      res.status(500).send(error);
    }
  };


exports.getBooksfilter = async (req, res) => {
  try {
    const { categories, authors } = req.query;
    let filter = [];

    let categoryIds = [];
    let authorIds = [];

    if (categories) {
      categoryIds = categories.split(",").map(id => id.trim());

      const existingCategories = await Book.distinct("category", { category: { $in: categoryIds } });

      if (existingCategories.length > 0) {
        filter.push({ category: { $in: existingCategories } });
      }
    }

    if (authors) {
      authorIds = authors.split(",").map(id => id.trim());

      const existingAuthors = await Book.distinct("author", { author: { $in: authorIds } });

      if (existingAuthors.length > 0) {
        filter.push({ author: { $in: existingAuthors } });
      }
    }

    if (filter.length === 0) {
      return res.status(400).json({ success: false, message: "No valid categories or authors found in books." });
    }

    const books = await Book.find({ $or: filter })
    .populate("author", "name") 
    .populate("category", "name");

    if (books.length > 0) {
      return res.status(200).json({ success: true, books });
    } else {
      return res.status(404).json({ success: false, message: "No books found with the given filters." });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

