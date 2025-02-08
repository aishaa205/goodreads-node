const { default: axios } = require("axios");
const Author = require('../models/author');
const Book = require("../models/book");
const Category = require("../models/category");
const mongoose = require("mongoose");
const { addImgurImage } = require("../utils/imgurImage");
const sendResponse = require('../utils/responseUtil');
const {uploadFile}=require ("../utils/googleDrive");

// ana momken 23mel create , get ,update ,delete, w fe get by id 



exports.createBook = async (req, res) => {
  try {
    const { title, author, edition } = req.body;
    const existingBook = await Book.findOne({ title, author, edition });

    if (existingBook) {
      return res.status(400).json({ success: false, message: "Book already exists." });
    }
    if (req.body.img && !req.body.img.startsWith("http")) {
      req.body.img = await addImgurImage(req.body.img);
    }
    const book = new Book(req.body);
    await book.save();

    res.status(201).json({ success: true, book });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(400).send(error);
  }
};


// Get all items with pagination and search 
// example of calling the api http://localhost:3001/books/paginated?page=1&limit=2
exports.getAllWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const name = req.query.name || '';
    const skip = (page - 1) * Number(limit);

    // Search filter: Matches if `name` contains the search term (case-insensitive)
    const filter = name ? { name: { $regex: `.*${name}.*`, $options: "i" } } : {};

    const items = await Book.find(filter)
    .populate("category", "name")
    .populate("author", "name")
    .skip(skip).limit(Number(limit));

    const total = await Book.countDocuments(filter);

    sendResponse(res, 200, {
      items,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    sendResponse(res, 500, null, "Failed to fetch books with pagination.");
  }
}

exports.getBooks = async (req, res) => {
 try {
   const books = await Book.find()
     .populate("category", "name")
     .populate("author", "name");
   res.status(200).send(books);
 } catch (error) {
   res.status(500).send(error);
 }
};

// exports.getBooks = async (req, res) => {
//   try {
//     const books = await Book.find().populate("category", "name").populate("author", "name");
//     res.status(200).json(books);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching books", error });
//   }
// };

exports.getBooksPopular = async (req, res) => {
  try {
    const books = await Book.find({}).sort({ views: -1 }).limit(20);
    res.status(200).send(books);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, { $inc: { views: 1 }, new: true }).populate("category", "name").populate("author", "name about");
    if (!book) {
      return res.status(404).send();
    }
    await Category.findByIdAndUpdate(book.category, { $inc: { views: 1 } });
    await Author.findByIdAndUpdate(book.author, { $inc: { views: 1 } });
    res.send(book);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

exports.updateBook = async (req, res) => {
  try {
    if (req.body.img && !req.body.img.startsWith("http")) {
      req.body.img = await addImgurImage(req.body.img);
    }
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book) {
      return res.status(404).send();
    }
    res.send(book);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
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


  