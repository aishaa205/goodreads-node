const express = require("express");
const userBookController = require("../controllers/userBookController");
//const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();
const authorizeToken = require("../middleware/authorize");
const authenticateToken = require("../middleware/authenticate");

router.post("/", authenticateToken, userBookController.createUserBook);
router.get("/", authenticateToken, userBookController.getUserBooks);

router.get("/userActivity/:userId", authenticateToken, userBookController.getUserBooks);
router.get("/:userId", authenticateToken, userBookController.getBooksForUser);

router.put("/:id", authenticateToken, userBookController.updateUserBook);
router.delete("/:id", authenticateToken, userBookController.deleteUserBook);

router.patch(
  "/rate/:bookId",
  authenticateToken,
  userBookController.handleRating
);
router.patch(
  "/state/:bookId",
  authenticateToken,
  userBookController.changeUserBookState
);
router.patch(
  "/review/:bookId",
  authenticateToken,
  userBookController.handleReview
);


module.exports = router;
