const { Router } = require("express");
const authControllers = require("../controllers/auth");
const passport = require("passport");
const router = Router();
//GET redirect url from .env
const redirectURL = process.env.REDIRECT_URL;
router.post("/register", authControllers.registerUser);
router.post("/login", authControllers.loginUser);
router.post("/verify", authControllers.verifyToken);
router.post("/send-otp", authControllers.sendOTP);
router.post("/verify-otp", authControllers.verifyOTP);

// Google OAuth Route redirects the user to the Google OAuth login page.
router.get("/google",passport.authenticate("google", { scope: ["profile", "email"] }));


//After successful authentication, it redirects the user to "http://localhost:3001" page and sets a cookie named "jwt" with the token value.
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = req.user.token;

    res.cookie("jwt", token, {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "Strict", // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry
    });

    res.redirect(redirectURL); // Redirect without exposing token
  }
);
module.exports = router;
