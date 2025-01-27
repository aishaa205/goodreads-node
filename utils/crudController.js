const sendResponse = (res, status, data = null, validationMessage = null) => {
    res.status(status).json({
      status: status === 200 || status === 201 ? "success" : "error",
      data,
      validationMessage,
    });
  };
  
  const crudControllers = (Model) => ({
    // Get all items
    getAll: async (req, res) => {
      try {
        const items = await Model.find();
        sendResponse(res, 200, items);
      } catch (error) {
        sendResponse(res, 500, null, "Failed to fetch items.");
      }
    },
  
    // Get all items with pagination
    getAllWithPagination: async (req, res) => {
      try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
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
        sendResponse(res, 400, null, "Failed to create item.");
      }
    },
  
    // Update an item
    updateOne: async (req, res) => {
      try {
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
        });
        if (!item) {
          return sendResponse(res, 404, null, "Item not found.");
        }
        sendResponse(res, 200, item, "Item updated successfully.");
      } catch (error) {
        sendResponse(res, 400, null, "Failed to update item.");
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
  });
  
  module.exports = { crudControllers, sendResponse };
  