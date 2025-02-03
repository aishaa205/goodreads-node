const express = require("express");
const authorController = require("../controllers/authorController");
const router = express.Router();
const authorizeToken = require("../middleware/authorize");
const authenticateToken = require("../middleware/authenticate");

router.post(
  "/",
  authenticateToken,
  authorizeToken,
  authorController.createAuthor
);
// router.get("/paginated",authenticateToken,authorController.getAllWithPagination);
router.get("/", authenticateToken, authorController.getAuthors);

router.get("/names", authenticateToken, authorController.getAuthorsNames);
router.get("/popular", authenticateToken, authorController.getAuthorsPopular);
router.get("/:id", authenticateToken, authorController.getAuthor);
router.put(
  "/:id",
  authenticateToken,
  authorizeToken,
  authorController.updateAuthor
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeToken,
  authorController.deleteAuthor
);

module.exports = router;
