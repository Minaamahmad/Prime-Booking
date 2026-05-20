import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../Models/Users.js";

dotenv.config();

const protect = async (req, res, next) => {
  const token =
    req.cookies?.token ||
    req.headers?.authorization?.split(' ')[1] ||
    null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id || decoded._id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (user.banned) {
      return res.status(403).json({ message: 'User is banned' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

export default protect;
