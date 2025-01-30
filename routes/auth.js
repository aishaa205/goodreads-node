const { Router } = require("express");
const authControllers = require("../controllers/auth");

const router = Router();

router.post("/register", authControllers.registerUser);
router.post("/login", authControllers.loginUser);
router.post("/verify", authControllers.verifyToken);


module.exports = router;