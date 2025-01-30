const Book = require('../models/book');
 

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
      const books = await Book.find().populate("category").populate("auhtor");
      res.status(200).send(books);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  

  exports.getBook = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id).populate("category").populate("auhtor");
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

//   const Category = require("../models/category"); // Assuming you have a Category model
// const Author = require("../models/author"); // Assuming you have an Author model
// exports.getBooksfilter = async (req, res) => {
//     try {
//         let filter = {};
//         // Parse categories from URL (expecting array format)
//         if (req.query.category) {
//             try {
//                 let categories = JSON.parse(req.query.category); // Convert stringified array to array
//                 if (Array.isArray(categories) && categories.length > 0) {
//                     // Convert category names to ObjectIds if needed
//                     const categoryDocs = await Category.find({ name: { $in: categories } });
//                     const categoryIds = categoryDocs.map(cat => cat._id);
//                     filter.category = { $in: categoryIds };
//                 }
//             } catch (error) {
//                 return res.status(400).json({ error: "Invalid category format" });
//             }
//         }
//         // Parse authors from URL (expecting array format)
//         if (req.query.author) {
//             try {
//                 let authors = JSON.parse(req.query.author); // Convert stringified array to array
//                 if (Array.isArray(authors) && authors.length > 0) {
//                     // Convert author names to ObjectIds if needed
//                     const authorDocs = await Author.find({ name: { $in: authors } });
//                     const authorIds = authorDocs.map(author => author._id);
//                     filter.author = { $in: authorIds };
//                 }
//             } catch (error) {
//                 return res.status(400).json({ error: "Invalid author format" });
//             }
//         }
//         // Filtering by title (case-insensitive search)
//         if (req.query.title) {
//             filter.title = { $regex: req.query.title, $options: "i" };
//         }
//         // Fetch books with filters
//         const books = await Book.find(filter)
//             .populate("category")
//             .populate("author");
//         res.status(200).json(books);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

exports.getBooksfilter = async (req, res) => {
  try {
    let filter = {};

    // Handle category filtering
    if (req.query.category) {
      try {
        let categories = JSON.parse(decodeURIComponent(req.query.category)); // Decode & parse JSON
        if (Array.isArray(categories) && categories.length > 0) {
          filter.category = { $in: categories };
        }
      } catch (error) {
        return res.status(400).json({ error: "Invalid category format" });
      }
    }

    // Handle author filtering
    if (req.query.author) {
      try {
        let authors = JSON.parse(decodeURIComponent(req.query.author)); // Decode & parse JSON
        if (Array.isArray(authors) && authors.length > 0) {
          filter.author = { $in: authors };
        }
      } catch (error) {
        return res.status(400).json({ error: "Invalid author format" });
      }
    }

    // Search by title (optional)
    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: "i" };
    }

    // Fetch books with applied filters
    const books = await Book.find(filter).populate("category").populate("author");

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


  