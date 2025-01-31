const author = require('../models/author');
const Book = require('../models/book');
const Category = require("../models/category");
const mongoose = require("mongoose");
 

// ana momken 23mel create , get ,update ,delete, w fe get by id 

exports.createBook = async (req, res) => {
    try {
      console.log("Received Data:", req.body); 


      if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
        return res.status(400).json({ error: "Invalid category ID format" });
    }
    if (!mongoose.Types.ObjectId.isValid(req.body.author)) {
        return res.status(400).json({ error: "Invalid author ID format" });
    }
      const book = new Book(req.body);
      await book.save();

  
      res.status(201).send(book);
    } catch (error) {
      console.error("Error creating book:", error);
      res.status(400).send(error);
    }
  };


  exports.getBooks = async (req, res) => {
    try {
      const books = await Book.find().populate("category").populate("author");
      res.status(200).send(books);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  

  exports.getBook = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id).populate("category").populate("author");
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

//note ay ta3amol betweeen front and back dayman bykon b el id 
// el search bykon b el name 3ady 

// exports.getBooksfilter = async (req, res) => {
//   try {
//     const { categories , authors } = req.query; // kol dol hyb2o ides 
//     console.log(req.query);
//     let filter = {};

//     // Check if categories are passed and add them to the filter
//     if (categories && categories.length > 0) {
//       // Split categories, trim extra spaces and convert to ObjectId
//       const categoryname = categories.split(","); // ides bardo 
//     }
//     let authorIds ;
//     // Check if authors are passed and add them to the filter
//     if (authors && authors.length > 0) {
//       // Split authors, trim extra spaces and convert to ObjectId
//       const authorName = authors.split(",")
//     }
//     // Query the books collection with the filter
//     const books = await Book.find({author:authorIds._id}).populate('author'); // Populate for better output
    
//     // If books are found, return them
//     if (books.length > 0) {
//       return res.status(200).json({ success: true, books });
//     } else {
//       return res.status(404).json({ success: false, message: "No books found with the given filters." });
//     }
//   } catch (error) {
//     console.error("Error:", error); // Log the error
//     return res.status(500).json({ success: false, message: "Server error." });
//   }
// };




// exports.getBooksfilter = async (req, res) => {
//   try {
//     const { categories, authors } = req.query;
//     let filter = {};

//     // Process category filter
//     if (categories) {
//       const categoryIds = categories.split(",").map(id => mongoose.Types.ObjectId(id.trim()));
//       filter.category = { $in: categoryIds };
//     }

//     // Process author filter
//     if (authors) {
//       const authorIds = authors.split(",").map(id => mongoose.Types.ObjectId(id.trim()));
//       filter.author = { $in: authorIds };
//     }

//     // Query the books with filters applied
//     const books = await Book.find(filter)
//       .populate("author") // Populating author details
//       .populate("category"); // Populating category details

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
