const express = require("express");
const router = express.Router();
const userCategoryController = require("../controllers/userCategoryController");
const authorizeToken = require("../middleware/authorize");
const authenticateToken = require("../middleware/authenticate");

router.get("/favorite", authenticateToken,authorizeToken, userCategoryController.getUserFavoriteCategories);
router.get("/other",authenticateToken,authorizeToken,userCategoryController.getOtherCategories);

module.exports = router;
