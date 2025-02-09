require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const Author = require("./models/author");
const Book = require("./models/book");
const Category = require("./models/category");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Fetch books from Open Library API
async function fetchBooks(subject) {
  try {
    const res = await axios.get(`https://openlibrary.org/subjects/${subject}.json?limit=100`);
    return res.data.works;
  } catch (error) {
    console.error(`Error fetching books for ${subject}:`, error);
    return [];
  }
}

// Fetch author details
async function fetchAuthor(authorKey) {
  try {
    const res = await axios.get(`https://openlibrary.org${authorKey}.json`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching author ${authorKey}:`, error);
    return null;
  }
}

// Insert books into database for a specific category
async function insertBooksForCategory(categoryName, description, subject) {
  const category = await Category.findOneAndUpdate(
    { name: categoryName },
    { name: categoryName, description },
    { upsert: true, new: true }
  );

  const books = await fetchBooks(subject);

  for (const book of books) {
    if (!book.authors || book.authors.length === 0) continue;

    const authorKey = book.authors[0].key;
    const authorData = await fetchAuthor(authorKey);
    if (!authorData) continue;

    const author = await Author.findOneAndUpdate(
      { name: authorData.name },
      {
        name: authorData.name,
        DOB: authorData.birth_date ? new Date(authorData.birth_date) : null,
        about: typeof authorData.bio === "object" ? authorData.bio.value || "No bio available" : authorData.bio || "No bio available",
        img: `https://covers.openlibrary.org/a/olid/${authorKey}-M.jpg`
      },
      { upsert: true, new: true }
    );

    const newBook = new Book({
      title: book.title,
      category: category._id,
      author: author._id,
      description: book.subject ? book.subject.join(", ") : "No description available",
      img: `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`,
      url: `https://openlibrary.org${book.key}`,
      edition: book.edition_count || 1,
    });

    await newBook.save();
  }
}

// Seed database with books and authors for multiple categories
async function seedDatabase() {
  //await Author.deleteMany({});
  //await Book.deleteMany({});
  //await Category.deleteMany({});

  //await insertBooksForCategory("Science Fiction", "Books about futuristic concepts.", "science_fiction");
  //await insertBooksForCategory("Novels", "Long fictional stories with deep narratives.", "fiction");
  //await insertBooksForCategory("Children's Books", "Books written for kids and young readers.", "children");

  //await insertBooksForCategory("Romance", "Books about love and romance.", "romance");
  //await insertBooksForCategory("Mystery", "Books filled with suspense and detective stories.", "mystery");
  //await insertBooksForCategory("History", "Books based on real historical events and figures.", "history");
  //await insertBooksForCategory("Fantasy", "Books about magical and imaginary worlds.", "fantasy");
  //await insertBooksForCategory("Self-Help", "Books that provide guidance and inspiration for personal development.", "self_help");

  await insertBooksForCategory("Cooking", "Books on various cooking techniques and recipes.", "cooking");

  console.log("Database seeded successfully!");
  mongoose.connection.close();
}

seedDatabase();
