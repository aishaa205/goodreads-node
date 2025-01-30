const express = require("express");
const router = express.Router();
const categoryControllers = require("../controllers/categoryController");
const authorizeToken = require("../middleware/authorize");
const authenticateToken = require("../middleware/authenticate");

router.get("/", authenticateToken, categoryControllers.getAll);
router.get(
  "/paginated",
  authenticateToken,
  categoryControllers.getAllWithPagination
);
router.get("/:id", authenticateToken, categoryControllers.getOne);
router.post(
  "/",

  authenticateToken,
  authorizeToken,
  categoryControllers.createOne
);
router.put(
  "/:id",

  authenticateToken,
  authorizeToken,
  categoryControllers.updateOne
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeToken,
  categoryControllers.deleteOne
);
router.get("/search", authenticateToken, categoryControllers.searchCategories);

module.exports = router;
