const express = require("express");
const adminRoutes = require("./admins");
const authorizeToken = require("../middleware/authorize");
const authenticateToken = require("../middleware/authenticate");
const authRouter = require("./auth");
const router = express.Router();

router.use("/auth", authRouter);
router.use("/admins", authenticateToken, authorizeToken, adminRoutes);

module.exports = router;
