const Category = require("../models/category");
const sendResponse = require('../utils/responseUtil');


const Model = Category;
const categoryController = {
  // Get all category names and their IDs
  getAllNames: async (req, res) => {
    try {
      const result = await Model.find({}, { _id: 1, name: 1 });
      if (!result) {
        return sendResponse(res, 404, null, "No items found.");
      }
      sendResponse(res, 200, result);
    } catch (error) {
      sendResponse(res, 500, null, "Failed to fetch items.");
    }
  },

  // Get all items with pagination
  getAllWithPagination: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * Number(limit);
      const items = await Model.find().skip(skip).limit(Number(limit));
      const total = await Model.countDocuments();

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
      sendResponse(res, 500, null, "Failed to fetch items with pagination.");
    }
  },

  // Get a single item by ID
  getOne: async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) {
        return sendResponse(res, 404, null, "Item not found.");
      }
      sendResponse(res, 200, item);
    } catch (error) {
      sendResponse(res, 500, null, "Failed to fetch the item.");
    }
  },

  // Create an item
  createOne: async (req, res) => {
    try {
      const item = await Model.create(req.body);
      sendResponse(res, 201, item, "Item created successfully.");
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        sendResponse(res, 400, null, messages);
      } else {
        sendResponse(res, 500, null, "Failed to create item.");
      }
    }
  },

  // Update an item with validation handling
  updateOne: async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!item) {
        return sendResponse(res, 404, null, "Item not found.");
      }
      sendResponse(res, 200, item, "Item updated successfully.");
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        sendResponse(res, 400, null, messages);
      } else {
        sendResponse(res, 500, null, "Failed to update item.");
      }
    }
  },

  // Delete an item
  deleteOne: async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) {
        return sendResponse(res, 404, null, "Item not found.");
      }
      sendResponse(res, 200, item, "Item deleted successfully.");
    } catch (error) {
      sendResponse(res, 500, null, "Failed to delete item.");
    }
  },

  // Search controller function
  search: async (req, res) => {
    try {
      const { name } = req.query;
      const items = await Model.find({ name: { $regex: name, $options: "i" } });
      if (items.length === 0) {
        return sendResponse(res, 404, null, "No items found.");
      }
      sendResponse(res, 200, items);
    } catch (error) {
      sendResponse(res, 500, null, "Failed to search items.");
    }
  },
};

module.exports = categoryController;
