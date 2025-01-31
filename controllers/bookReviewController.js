const UserBook = require("../models/userBook");
const sendResponse = require("../utils/responseUtil");

const bookReviewController = {
  // Get book reviews by book ID
  getAll: async (req, res) => {
    try {
      const { id } = req.params;
      const reviews = await UserBook.find({ book: id });

      if (!reviews || reviews.length === 0) {
        return sendResponse(res, 404, null, "No reviews found for this book");
      }
      sendResponse(res, 200, reviews);
    } catch (error) {
      sendResponse(res, 500, null, "Error getting book reviews");
    }
  },

  // Create book review (one per user per book)
  createOne: async (req, res) => {
    try {
      const { user, book, state, rating, review } = req.body;

      const existingReview = await UserBook.findOne({ user, book });
      if (existingReview) {
        return sendResponse(
          res,
          400,
          null,
          "You have already reviewed this book"
        );
      }

      const newReview = new UserBook({ user, book, state, rating, review });
      await newReview.save();
      sendResponse(res, 201, newReview, "Book review created successfully");
    } catch (error) {
      sendResponse(res, 500, null, "Error creating book review");
    }
  },

  // Update book review
  updateOne: async (req, res) => {
    try {
      const { id } = req.params;
      const { state, rating, review } = req.body;

      const updateData = {};
      if (state) updateData.state = state;
      if (rating) updateData.rating = rating;
      if (review) updateData.review = review;

      const updatedReview = await UserBook.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedReview) {
        return sendResponse(res, 404, null, "Book review not found");
      }

      sendResponse(res, 200, updatedReview, "Book review updated successfully");
    } catch (error) {
      if (error.name === "ValidationError") {
        return sendResponse(res, 400, null, "Validation error");
      }
      sendResponse(res, 500, null, "Error updating book review");
    }
  },

  // Delete book review
  deleteOne: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedReview = await UserBook.findByIdAndDelete(id);

      if (!deletedReview) {
        return sendResponse(res, 404, null, "Book review not found");
      }
      sendResponse(res, 200, deletedReview, "Book review deleted successfully");
    } catch (error) {
      sendResponse(res, 500, null, "Error deleting book review");
    }
  },
};

module.exports = bookReviewController;
