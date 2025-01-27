const searchController = (Model, searchField) => async (req, res) => {
    try {
      const { name } = req.query;
      const items = await Model.find({
        [searchField]: { $regex: name, $options: "i" },
      });
      if (items.length === 0) {
        return res.status(404).json({ status: "error", validationMessage: "No items found." });
      }
      res.status(200).json({ status: "success", data: items });
    } catch (error) {
      res.status(500).json({ status: "error", validationMessage: "Failed to search items." });
    }
  };
  
  module.exports = { searchController };
  