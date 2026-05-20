import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../Models/Users.js";
import dotenv from "dotenv";

dotenv.config();

// Only initialize Google strategy if environment variables are set
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true, // Allow access to req object
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ provider_id: profile.id });
          const email = profile.emails[0].value.toLowerCase();
          const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
          const isAdminEmail = adminEmails.includes(email);

          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              role: isAdminEmail ? 'Admin' : null,
              provider: "google",
              provider_id: profile.id,
              avatar: profile.photos[0].value,
            });
          } else if (isAdminEmail && user.role !== 'Admin') {
            user.role = 'Admin';
            await user.save();
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});