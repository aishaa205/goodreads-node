const express = require("express");
const authorizeToken = require("../middleware/authorize");
const authenticateToken = require("../middleware/authenticate");
const router = express.Router();

const siteContentController = require("../controllers/siteContentController");
//router.get(authenticateToken,authorizeToken,"/",  siteContentController.getContent);
//router.put(authenticateToken,authorizeToken,"/:id",siteContentController.updateContent);
router.get("/:type", siteContentController.getContent);
router.put("/:type",siteContentController.updateContent);
module.exports = router;