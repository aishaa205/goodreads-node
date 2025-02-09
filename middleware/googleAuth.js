const passport = require("passport");
const User = require("../models/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            id: profile.id,
            email: profile.emails[0].value,
            img: profile.photos[0].value,
            username: profile.emails[0].value.split("@")[0],
            fName: profile.name.givenName,
            lName: profile.name.familyName,
            googleId: profile.id,
            subscriptionType: "free",
            role: "user",
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
module.exports = passport; 
