const Category = require("../models/category");
const sendResponse = require("../utils/responseUtil");

const Model = Category;
const categoryController = {
  // Get all category names and their IDs
  // example of calling the api http://localhost:3001/Categories/
  getAllNames: async (req, res) => {
    try {
      const result = await Model.find({}, { _id: 1, name: 1 });
      if (!result) {
        return sendResponse(res, 404, null, "No categories found.");
      }
      sendResponse(res, 200, result);
    } catch (error) {
      console.log(error);
      sendResponse(res, 500, null, "Failed to fetch items.");
    }
  },

  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).send(categories);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  // Get all items with pagination and search
  // example of calling the api http://localhost:3001/categories/paginated?page=1&limit=2&name=Rowling
  getAllWithPagination: async (req, res) => {
    try {
      const page = req.query.page;
      const limit = req.query.limit;
      const name = req.query.name || "";
      const skip = (page - 1) * Number(limit);

      // Search filter: Matches if `name` contains the search term (case-insensitive)
      const filter = name
        ? { name: { $regex: `.*${name}.*`, $options: "i" } }
        : {};

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
      sendResponse(
        res,
        500,
        null,
        "Failed to fetch categories with pagination."
      );
    }
  },

  getCategoriesPopular: async (req, res) => {
    try {
      const items = await Model.find().sort({ views: -1 }).limit(20);
      sendResponse(res, 200, items);
    } catch (error) {
      sendResponse(res, 500, null, "Failed to fetch popular categories.");
    }
  },

  // Get a single item by ID
  // example of calling the api http://localhost:3001/Categories/64f4b7b6b5b5b5b5b5b5b5b5
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
  // body { name: "New name" , description: "New description" }
  createOne: async (req, res) => {
    try {
      const item = await Model.create(req.body);
      sendResponse(res, 201, item, "Category created successfully.");
    } catch (error) {
      // Handle duplicate key error
      if (error.code === 11000) {
        return sendResponse(res, 400, null, "Category name already exists.");
        // Handle other validation errors
      } else if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return sendResponse(res, 400, null, messages);
      }
      sendResponse(res, 500, null, error.message);
    }
  },

  // Update an item with validation handling
  // body: { name: "New name" , description: "New description" }
  // example of calling the api http://localhost:3001/Categories/64f4b7b6b5b5b5b5b5b5b5b5
  updateOne: async (req, res) => {
    try {
      if (req.body.img && !req.body.img.startsWith("http")) {
        req.body.img = await addImgurImage(req.body.img);
      }
      // Check for duplicate before updating
      const existingItem = await Model.findOne({ name: req.body.name });
      if (existingItem && existingItem._id.toString() !== req.params.id) {
        return sendResponse(res, 400, null, "Category name already exists.");
      }

      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!item) {
        return sendResponse(res, 404, null, "Item not found.");
      }

      sendResponse(res, 200, item, "Category updated successfully.");
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        sendResponse(res, 400, null, messages);
      } else {
        sendResponse(
          res,
          500,
          null,
          "Failed to update category. " + error.message
        );
      }
    }
  },

  // Delete an item
  deleteOne: async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) {
        return sendResponse(res, 404, null, "Category not found.");
      }
      sendResponse(res, 200, item, "Category deleted successfully.");
    } catch (error) {
      sendResponse(res, 500, null, "Failed to delete category.");
    }
  },
};

module.exports = categoryController;
