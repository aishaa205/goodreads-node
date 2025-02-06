const express = require("express");
const userBookController = require("../controllers/userBookController");
//const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();
const authorizeToken = require("../middleware/authorize");
const authenticateToken = require("../middleware/authenticate");

router.post("/", authenticateToken, userBookController.createUserBook);
router.get("/:id", authenticateToken, userBookController.getUserBooks);
router.put("/:id", authenticateToken, userBookController.updateUserBook);
router.delete("/:id", authenticateToken, userBookController.deleteUserBook);

router.patch("/rate/:bookId",authenticateToken,userBookController.handleRating)
module.exports = router;
