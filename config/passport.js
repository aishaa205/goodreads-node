const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const authToken = require("../utils/authToken");
passport.use(
  new GoogleStrategy(
    {
      // credentials
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callback URL to redirect after login or signup
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        debugger;
        // check if user already exists and get user
        let user = await User.findOne({ email: profile.emails[0].value });
        
        // if user doesn't exist, create new user ( register new user )
        if (!user) {
          user = new User({
            fName: profile.name.givenName,
            lName: profile.name.familyName,
            username: profile.emails[0].value.split("@")[0],
            email: profile.emails[0].value,
            img: profile.photos[0].value,
            emailVerified: true,
          });

          await user.save();
        }

        // Generate JWT token
        const token = authToken(user);

        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
