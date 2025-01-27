const Book = require('../models/books');
 

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
      const books = await Book.find()//.populate("category").populate("auhtor");
      res.status(200).send(books);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  

  exports.getBook = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id)//.populate("category").populate("auhtor");
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