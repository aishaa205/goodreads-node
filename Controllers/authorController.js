const Author = require("../models/authors");



exports.createAuthor = async (req, res) => {
    try {
      const author = new Author(req.body);
      await author.save();
      res.status(201).send(author);
      // console.log("hello")
    } catch (error) {
      res.status(400).send(error);
    }
  };




  exports.getAuthors = async (req, res) => {
    try {
      const authors = await Author.find().populate("books");
      res.status(200).send(authors);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  exports.getAuthor = async (req, res) => {
    try {
      const author = await Author.findById(req.params.id).populate("books");
      if (!author) {
        return res.status(404).send();
      }
      res.send(author);
    } catch (error) {
      res.status(500).send(error);
    }
  };


  exports.updateAuthor = async (req, res) => {
    try {
      const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!author) {
        return res.status(404).send();
      }
      res.send(author);
    } catch (error) {
      res.status(400).send(error);
    }
  };



  exports.deleteAuthor = async (req, res) => {
    try {
      const author = await Author.findByIdAndDelete(req.params.id);
      if (!author) {
        return res.status(404).send("ayhaga");
      }
      res.send(author);
    } catch (error) {
      res.status(500).send(error);
    }
  };