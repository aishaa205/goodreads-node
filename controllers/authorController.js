const Author = require("../models/author");
const Book = require("../models/book");

exports.createAuthor = async (req, res) => {
  try {
    if (req.body.img && !req.body.img.startsWith("http")) {
      req.body.img = await addImgurImage(req.body.img);
    }
    const author = new Author(req.body);
    const existingAuthor = await Author.findOne({ name: req.body.name });
    if (existingAuthor) {
      return res.status(400).json({ message: "Author already exists" });
    }
    await author.save();
    res.status(201).send(author);
    // console.log("hello")
  } catch (error) {
    res.status(400).send(error);
  }
};



exports.getAuthorsNames = async (req, res) => {
  try {
    const authors = await Author.find({}, { _id: 1, name: 1 });
    res.status(200).send(authors);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get all items with pagination and search 
// example of calling the api http://localhost:3001/authors/paginated
exports.getAllWithPagination = async (req, res) => {
  try {
    const { page = 1, limit = 10, name } = req.body; // Read search term from body
    const skip = (page - 1) * Number(limit);

    // Search filter: Matches if `name` contains the search term (case-insensitive)
    const filter = name ? { name: { $regex: `.*${name}.*`, $options: "i" } } : {};

    const items = await Model.find(filter).skip(skip).limit(Number(limit));
    const total = await Model.countDocuments(filter);

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
    sendResponse(res, 500, null, "Failed to fetch author with pagination.");
  }
}

exports.getAuthorsPopular = async (req, res) => {
  try {
    const authors = await Author.find({}).sort({ views: -1 }).limit(20);
    res.status(200).send(authors);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
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
    if (req.body.img && !req.body.img.startsWith("http")) {
      req.body.img = await addImgurImage(req.body.img);
    }
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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
