const express = require("express");
const authorController = require("../Controllers/authorController");
const router = express.Router();



router.post("/", authorController.createAuthor);  
router.get("/", authorController.getAuthors);
router.get("/:id", authorController.getAuthor);  
router.put("/:id", authorController.updateAuthor); 
router.delete("/:id", authorController.deleteAuthor); 

module.exports = router;