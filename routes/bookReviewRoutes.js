const express = require("express");
const router = express.Router();

const bookReviewController = require("../controllers/bookReviewController");
router.get("/",  bookReviewController.getAll);
router.post("/",bookReviewController.createOne);
router.put("/:id",bookReviewController.updateOne);
router.delete("/:id",bookReviewController.deleteOne);

module.exports = router;

