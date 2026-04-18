import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../Models/Users.js";
import protect from "../Middlewares/auth.js";

dotenv.config();

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

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

router.get('/google', (req, res, next) => {
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

    // If user doesn't have a role set, redirect to role selection
    if (!user.role) {
      // Create a temporary token for role selection
      const tempToken = jwt.sign(
        { id: user._id, needsRoleSelection: true },
        process.env.JWT_SECRET,
        { expiresIn: '10m' } // Short expiry for security
      );

      res.cookie('temp_token', tempToken, getCookieOptions());
      return res.redirect(`${FRONTEND_URL}/select-role`);
    }

    // User already has a role, proceed normally
    const token = createAuthToken(user);
    res.cookie('token', token, getCookieOptions());
    res.redirect(FRONTEND_URL);
  }
);

router.post('/select-role', async (req, res) => {
  try {
    const { role } = req.body;
    const tempToken = req.cookies?.temp_token;

    if (!tempToken) {
      return res.status(401).json({ message: 'No temporary token found' });
    }

    if (!role || !['Guest', 'Owner'].includes(role)) {
      return res.status(400).json({ message: 'Valid role (Guest or Owner) is required' });
    }

    // Verify temp token
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    if (!decoded.needsRoleSelection) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Update user role
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    // Clear temp token and create real token
    res.clearCookie('temp_token', getCookieOptions());
    const token = createAuthToken(user);
    res.cookie('token', token, getCookieOptions());

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Role selection failed', error: error.message });
  }
});

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

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
});

export default router;

