const userBookModel = require("../models/userBook");
const { param } = require("../routes");

exports.createUserBook = async (req, res) => {
  try {
    console.log("test");
    const newUserBook = new userBookModel(req.body);
    const existingUserBook = await userBookModel.findOne({
      user: req.body.user,
      book: req.body.book,
    });
    console.log(existingUserBook);
    if (existingUserBook) {
      return res.status(400).json({ message: "UserBook already exists" });
    }
    await newUserBook.save();
    res.status(201).send(newUserBook);
  } catch (error) {
    res.status(400).send("error");
  }
};

// get all user books by userId
// example of calling the api http://localhost:3001/userBook/{{userId}}
exports.getUserBooks = async (req, res) => {
  try {
    const userBooks = await userBookModel
      .find({ user: req.params.userId }, "_id rating review state ")
      .populate("user", "name")
      .populate({
        path: "book",
        select: "title img",
        populate: { path: "author", select: "name" },
      });

    if (userBooks.length === 0) {
      return res.status(404).send({ message: "No books found for this user." });
    }

    res.send(userBooks);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getBooksForUser = async (req, res) => {
  try {
    const userBooks = await userBookModel
      .find({ user: req.params.userId }) // Filter by user ID
      .populate("book"); // Populate book details

    if (!userBooks || userBooks.length === 0) {
      return res.status(404).json({ message: "No books found for this user" });
    }

    res.json(userBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserBook = async (req, res) => {
  try {
    const userBook = await userBookModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!userBook) {
      return res.status(404).send();
    }
    res.send(userBook);
  } catch (error) {
    res.status(400).send(error);
  }
};

// example of calling the api http://localhost:3001/userBook/{{id}}
// delete a user book by id
exports.deleteUserBook = async (req, res) => {
  try {
    const userBook = await userBookModel.findByIdAndDelete(req.params.id);
    if (!userBook) {
      return res.status(404).send();
    }
    res.send(userBook);
  } catch (error) {
    res.status(500).send(error);
  }
};

//example of calling the api http://localhost:3001/userBook/rate/{{bookId}}
// body {rating: 5 , userId: 1}
// each user has one rating per book
exports.handleRating = async (req, res) => {
  try {
    const { rating, userId } = req.body;
    const { bookId } = req.params;
    // Check if user has already rated this book
    let userBook = await userBookModel.findOne({ book: bookId, user: userId });

    if (!userBook) {
      userBook = new userBookModel({ book: bookId, user: userId, rating });
      await userBook.save();
      return res.status(201).send(userBook);
    }

    // Update existing rating
    userBook.rating = rating;
    await userBook.save();
    res.status(200).send(userBook);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


//create a function to change user book state
exports.changeUserBookState = async (req, res) => {
  try {
    const { state, userId } = req.body;
    const { bookId } = req.params;
    // Check if user has already added status to this book
    let userBook = await userBookModel.findOne({ book: bookId, user: userId });

    if (!userBook) {
      userBook = new userBookModel({ book: bookId, user: userId, state });
      await userBook.save();
      return res.status(201).send(userBook);
    }

    // Update existing status
    userBook.state = state;
    await userBook.save();
    res.status(200).send(userBook);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

//example of calling the api http://localhost:3001/userBook/review/{{bookId}}
// body {review: "This is a review" , userId: 1}
// each user has one review per book
exports.handleReview = async (req, res) => {
  try {
    const { review, userId } = req.body;
    const { bookId } = req.params;
    // Check if user has already rated this book
    let userBook = await userBookModel.findOne({ book: bookId, user: userId });
    if (!userBook) {
      userBook = new userBookModel({ book: bookId, user: userId, review });
      await userBook.save();
      return res.status(201).send(userBook);
    }

    // Update existing review
    userBook.review = review;
    await userBook.save();
    res.status(200).send(userBook);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
