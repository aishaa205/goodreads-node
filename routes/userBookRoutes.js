const express = require("express");
const userBookController = require("../controllers/userBookController");
//const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();
const authorizeToken = require("../middleware/authorize");
const authenticateToken = require("../middleware/authenticate");

router.post("/", authenticateToken, userBookController.createUserBook);
router.get("/", authenticateToken, userBookController.getUserBooks);
router.get("/:id", authenticateToken, userBookController.getUserBook);
router.put("/:id", authenticateToken, userBookController.updateUserBook);
router.delete("/:id", authenticateToken, userBookController.deleteUserBook);
module.exports = router;
