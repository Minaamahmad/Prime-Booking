import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../Models/Users.js";

dotenv.config();

const router = express.Router();

const createAuthToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
});

router.get('/auth/google', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })(req, res, next);
});

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = req.user;
    const token = createAuthToken(user);

    res.cookie('token', token, getCookieOptions());
    res.redirect('/');
  }
);

router.post('/demo', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Missing demo login fields' });
    }

    const providerId = email.toLowerCase();
    let user = await User.findOne({ provider_id: providerId, provider: 'demo' });

    if (!user) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        role,
        provider: 'demo',
        provider_id: providerId,
      });
    } else if (user.role !== role) {
      user.role = role;
      await user.save();
    }

    const token = createAuthToken(user);
    res.cookie('token', token, getCookieOptions());
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Demo login failed', error: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', getCookieOptions());
  res.json({ message: 'Logged out' });
});

export default router;

