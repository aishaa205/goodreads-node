const express = require("express");
const authorizeToken = require("../middleware/authorize");
const authenticateToken = require("../middleware/authenticate");
const router = express.Router();

const siteContentController = require("../controllers/siteContentController");

// get all content
router.get("/", siteContentController.getContent);

//get content by type (about or terms)
router.get("/:type", siteContentController.getContentByType);

//update content by type (about or terms)
router.put("/:type",authenticateToken,authorizeToken,siteContentController.updateContent);
module.exports = router;