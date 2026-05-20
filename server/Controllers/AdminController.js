import User from "../Models/Users.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-provider_id -__v');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

export const banUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }

    if (req.user._id.toString() === id) {
      return res.status(403).json({ message: 'Admins cannot ban themselves' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'Admin') {
      return res.status(403).json({ message: 'Cannot ban another admin' });
    }

    user.banned = true;
    await user.save();

    res.json({ message: 'User banned successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to ban user', error: error.message });
  }
};

export const unbanUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.banned = false;
    await user.save();

    res.json({ message: 'User unbanned successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unban user', error: error.message });
  }
};
