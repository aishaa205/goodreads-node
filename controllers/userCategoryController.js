const User = require("../models/user");
const sendResponse = require("../utils/responseUtil");

const userCategoryController = {
  //returns categoryname and id of user favorite categories
  //userId should be passed in jwt token as user_id
  getUserFavoriteCategories: async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).populate("favoriteCategories");
      if (!user) {
        return sendResponse(res, 404, null, "User not found");
      }
      const categories = user.favoriteCategories.map((category) => ({
        id: category._id,
        name: category.name,
      }));
      return sendResponse(res, 200, categories);
    } catch (error) {
      return sendResponse(res, 500, null, error.message);
    }
  },

  //returns all categories except user's favorite categories
  //userId should be passed in jwt token as user_id
  //returns categoryname and id
  getOtherCategories: async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).populate("favoriteCategories");
      if (!user) {
        return sendResponse(res, 404, null, "User not found");
      }
      // Extract the _id values from the user's favorite categories
      const favoriteCategoryIds = user.favoriteCategories.map(
        (category) => category._id
      );

      // Find categories that are NOT in the user's favorite categories
      const categories = await Category.find({
        _id: { $nin: favoriteCategoryIds },
      }).select("name _id");

      return sendResponse(res, 200, categories);
    } catch (error) {
      return sendResponse(res, 500, null, error.message);
    }
  },
};

module.exports = userCategoryController;
