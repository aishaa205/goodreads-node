const User = require("../models/user");
const Book = require("../models/book");
const Author = require("../models/author");
const Category = require("../models/category");
const bcrypt = require("bcrypt");

exports.registerAdmin = async (req, res) => {
  try {
    const saltRounds = 10; //how many times the hashing algorithm runs
    const { fName, lName, username, email, password } = req.body;
    //check if existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newAdmin = new User({
      fName,
      lName,
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });
    const savedAdmin = await newAdmin.save();
    res.status(201).json({ message: "Admin created", admin: savedAdmin });
  } catch (error) {
    res.status(500).send("Error creating admin");
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, image, views } = req.body;
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const newCategory = new Category({
      name,
      description,
      image,
      views,
    });
    await newCategory.save();
    res.status(201).json({ message: "Category created", newCategory });
  } catch (error) {
    res.status(500).json({ message: "Error creating category" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, views } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (image) updateData.image = image;
    if (views) updateData.views = views;
    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true, //findByIdAndUpdate will return the updated Document, true is the default value.
      runValidators: true, //if there is validators in schema check if the new data pass the validators.
    });
    if (!updatedCategory) {
      //incase there is a problem with server or Wrong ID sent,
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Category updated", updatedCategory });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error" });
    }
    res.status(500).json({ message: "Error updating product" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};

exports.createBook = async (req, res) => {
  try {
    const { title, category, author, description, img, views } = req.body;
    const existingBook = await Book.findOne({ title });
    if (existingBook) {
      return res.status(400).json({ message: "Book already exists" });
    }
    const newBook = new Book({
      title,
      category,
      author,
      description,
      img,
      views,
    });
    await newBook.save();
    res.status(201).json({ message: "Book created", newBook });
  } catch (error) {
    res.status(500).json({ message: "Error creating Book", error });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, author, description, img, views } = req.body;
    const updateData = {};
    if (title) updateData.title = title;
    if (category) updateData.category = category;
    if (author) updateData.author = author;
    if (description) updateData.description = description;
    if (img) updateData.img = img;
    if (views) updateData.views = views;

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true, //findByIdAndUpdate will return the updated Document, true is the default value.
      runValidators: true, //if there is validators in schema check if the new data pass the validators.
    });
    if (!updatedBook) {
      //incase there is a problem with server or Wrong ID sent,
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book updated", updatedBook });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error" });
    }
    res.status(500).json({ message: "Error updating book" });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book" });
  }
};

exports.createAuthor = async (req, res) => {
  try {
    const { name, DOB, about, books = [], views } = req.body; //if books is not provided it will be an empty array.
    const existingAuthor = await Author.findOne({ name });
    if (existingAuthor) {
      return res.status(400).json({ message: "Author already exists" });
    }
    const newAuthor = new Author({
      name,
      DOB,
      about,
      books,
      views,
    });
    await newAuthor.save();
    res.status(201).json({ message: "Author created", newAuthor });
  } catch (error) {
    res.status(500).json({ message: "Error creating Author", error });
  }
};

exports.updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, DOB, about, books, img, views } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (DOB) updateData.DOB = DOB;
    if (about) updateData.about = about;
    if (books) updateData.books = books;
    if (img) updateData.img = img;
    if (views) updateData.views = views;

    const updatedAuthor = await Author.findByIdAndUpdate(id, updateData, {
      new: true, //findByIdAndUpdate will return the updated Document, true is the default value.
      runValidators: true, //if there is validators in schema check if the new data pass the validators.
    });
    if (!updatedAuthor) {
      //incase there is a problem with server or Wrong ID sent,
      return res.status(404).json({ message: "Author not found" });
    }
    res.json({ message: "Author updated", updatedAuthor });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error" });
    }
    res.status(500).json({ message: "Error updating author" });
  }
};

exports.deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAuthor = await Author.findByIdAndDelete(id);
    if (!deletedAuthor) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.json({ message: "Author deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting author" });
  }
};
