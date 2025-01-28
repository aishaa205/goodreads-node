const express = require("express");
const { adminController } = require("../controllers");

const router = express.Router();

router.post("/categories", adminController.createCategory);
router.put("/categories/:id", adminController.updateCategory);
router.delete("/categories/:id", adminController.updateCategory);

router.post("/authors", adminController.createAuthor);
router.put("/authors/:id", adminController.updateAuthor);
router.delete("/authors/:id", adminController.updateAuthor);

router.post("/Books", adminController.createBook);
router.put("/Books/:id", adminController.updateBook);
router.delete("/Books/:id", adminController.updateBook);

module.exports = router;
