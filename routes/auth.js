const { Router } = require("express");
const passport = require("passport");
const authControllers = require("../controllers/auth");
const authenticateToken = require("../middleware/authenticate");

const User = require("../models/user");
const { generateToken } = require("../utils/authToken");
const { randomBytes } = require("crypto");
const router = Router();
//GET redirect url from .env
const redirectURL = process.env.REDIRECT_URL;
router.post("/register", authControllers.registerUser);
router.post("/login", authControllers.loginUser);
router.post("/verify", authControllers.verifyToken);
router.post("/send-otp", authControllers.sendOTP);
router.post("/verify-otp", authControllers.verifyOTP);
router.put("/update-user/:id",  authenticateToken, authControllers.updateUser);
router.get("/get-user/:id",  authenticateToken, authControllers.getUser);
router.post("/renew-subscription/:id", authControllers.renewSubscription);
router.post("/verify-payment/:id", authControllers.verifySubscription);
router.post("/forget-password", authControllers.forgetPassword);

// Google OAuth Route redirects the user to the Google OAuth login page.
// Start Google OAuth flow
router.get("/google",passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback route
// Finish Google OAuth flow and consume OAuth tokens
// Handles Google Login manually

router.post("/google/callback", async (req, res) => {
  try {
    const { fName, lName, email, googleId, picture } = req.body;
    // Check if user exists in DB
    let user = await User.findOne({ email });

    if (user) {
      // If user exists but doesn't have googleId, update it
      if (!user.googleId) {
        user.googleId = googleId;
        user.emailVerified = true;
        await user.save();
      }
    } else {
      // Create a new user if no existing email is found
      user = new User({ fName, lName, email, googleId
              , img: picture 
              , role: "user" 
              , subscriptionType: "free" 
              , emailVerified: true 
              , password: randomBytes(16).toString("hex")
              , username: email.split("@")[0] });
      await user.save();
    }
    // Generate JWT Token
    const token = generateToken(user);
    res.json({ token, user });

  } catch (error) {
    res.status(500).json({ message: "Error processing Google login" });
  }
});




module.exports = router;
