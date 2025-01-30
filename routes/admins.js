const express = require("express");
const { adminController } = require("../controllers");

const router = express.Router();

router.post("/register", adminController.registerAdmin);

router.post("/categories", adminController.createCategory);
router.put("/categories/:id", adminController.updateCategory);
router.delete("/categories/:id", adminController.deleteCategory);

router.post("/authors", adminController.createAuthor);
router.put("/authors/:id", adminController.updateAuthor);
router.delete("/authors/:id", adminController.deleteAuthor);

router.post("/books", adminController.createBook);
router.put("/books/:id", adminController.updateBook);
router.delete("/books/:id", adminController.deleteBook);

module.exports = router;
