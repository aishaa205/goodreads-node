const author = require('../models/author');
const Book = require('../models/book');
const Category = require("../models/category");
const mongoose = require("mongoose");
 

// ana momken 23mel create , get ,update ,delete, w fe get by id 

exports.createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();

    res.status(201).send(book);
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

// filter matense4

// exports.getBooksfilter = async (req, res) => {
//   try {
//     const { categories, authors } = req.query;
//     let filter = {};

//     // Process category filter
//     if (categories) {
//       const categoryIds = categories.split(",")//.map(id => mongoose.Types.ObjectId(id.trim()));
//       filter.category = { $in: categoryIds };
//     }

//     // Process author filter
//     if (authors) {
//       const authorIds = authors.split(",")//.map(id => mongoose.Types.ObjectId(id.trim()));
//       filter.author = { $in: authorIds };
//     }

//     // Query the books with filters applied
//     const books = await Book.find(filter)
//       //.populate("author") // Populating author details
//       //.populate("category"); // Populating category details

//     if (books.length > 0) {
//       return res.status(200).json({ success: true, books });
//     } else {
//       return res.status(404).json({ success: false, message: "No books found with the given filters." });
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ success: false, message: "Server error." });
//   }
// };

/////////////////////////////////////


// exports.getBooksfilter = async (req, res) => {
//   try {
//     const { categories, authors } = req.query;
//     let filter = {};

//     let categoryIds = [];
//     let authorIds = [];

//     // Validate category IDs by checking their existence in the Book collection
//     if (categories) {
//       categoryIds = categories.split(",")//.map(id => id.trim());
//        console.log(categoryIds);
//       // Find unique category IDs that exist in the Book collection
//       const existingCategories = await Book.distinct("category", { category: { $in: categoryIds } });
//       console.log(existingCategories);
//       if (existingCategories.length !== categoryIds.length) {
//         return res.status(400).json({ success: false, message: "One or more category IDs do not exist in any book." });
//       }

//       filter.category = { $in: existingCategories };
//     }

//     // Validate author IDs by checking their existence in the Book collection
//     if (authors) {
//       authorIds = authors.split(",");//.map(id => id.trim());
// console.log(authorIds);
//       // Find unique author IDs that exist in the Book collection
//       const existingAuthors = await Book.distinct("author", { author: { $in: authorIds } });
//        console.log(existingAuthors);
//       if (existingAuthors.length !== authorIds.length) {
//         return res.status(400).json({ success: false, message: "One or more author IDs do not exist in any book." });
//       }

//       filter.author = { $in: existingAuthors };
//     }

//     // Query the books with the validated filters
//     const books = await Book.find(filter)
//       .populate("author") // Populate author details
//       .populate("category"); // Populate category details

//     if (books.length > 0) {
//       return res.status(200).json({ success: true, books });
//     } else {
//       return res.status(404).json({ success: false, message: "No books found with the given filters." });
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ success: false, message: "Server error." });
//   }
// };




//////////////////////////////////////////
//da a7san aw7da fehom
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
      .populate("author")
      .populate("category");

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

