const express = require("express");

const userRoutes = require("./users");

const adminRoutes = require("./admins");

router.use("/users", userRoutes);
router.use("/admins", adminRoutes);

module.exports = router;
