const express = require("express");
const bookController = require("../controllers/bookController");
const router = express.Router();
const authorizeToken = require("../middleware/authorize");
const authenticateToken = require("../middleware/authenticate");

router.post("/", authenticateToken, authorizeToken, bookController.createBook);
router.get("/paginated", authenticateToken, bookController.getAllWithPagination);
router.get("/", authenticateToken, bookController.getBooks);
router.get("/filter", authenticateToken, bookController.getBooksfilter);
router.get("/popular", bookController.getBooksPopular);
router.get("/:id", authenticateToken, bookController.getBook);
router.put(
  "/:id",
  authenticateToken,
  authorizeToken,
  bookController.updateBook
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeToken,
  bookController.deleteBook
);
module.exports = router;
