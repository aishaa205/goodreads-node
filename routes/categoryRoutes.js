const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authorizeToken = require("../middleware/authorize");
const authenticateToken = require("../middleware/authenticate");

router.get("/names", authenticateToken, categoryController.getAllNames);
router.get(
  "/paginated",
  authenticateToken,
  categoryController.getAllWithPagination
);
router.get(
  "/popular",
  authenticateToken,
  categoryController.getCategoriesPopular
);
router.get("/:id", authenticateToken, categoryController.getOne);
router.post(
  "/",
  authenticateToken,
  authorizeToken,
  categoryController.createOne
);
router.put(
  "/:id",
  authenticateToken,
  authorizeToken,
  categoryController.updateOne
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeToken,
  categoryController.deleteOne
);

module.exports = router;
