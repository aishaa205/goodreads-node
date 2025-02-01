const express = require("express");
const authorizeToken = require("../middleware/authorize");
const authenticateToken = require("../middleware/authenticate");
const router = express.Router();

const siteContentController = require("../controllers/siteContentController");
router.get("/:type", siteContentController.getContent);
router.put("/:type",authenticateToken,authorizeToken,siteContentController.updateContent);
module.exports = router;