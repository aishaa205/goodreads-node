const express = require('express');
const router = express.Router();
const categoryControllers = require("../controllers/categoryController");

router.get("/", categoryControllers.getAll);
router.get("/paginated", categoryControllers.getAllWithPagination);
router.get("/:id", categoryControllers.getOne);
router.post("/", categoryControllers.createOne);
router.put("/:id", categoryControllers.updateOne);
router.delete("/:id", categoryControllers.deleteOne);
router.get("/search", categoryControllers.searchCategories);

module.exports = router;