const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');

// Create a token that lasts 7 days
const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// What we send back to the client (never the password)
const userData = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role, phone: u.phone, loyaltyPoints: u.loyaltyPoints, avatar: u.avatar });

// Register a new patient
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const user = await User.create({ name, email, password, phone, role: 'patient' });
    res.status(201).json({ token: makeToken(user._id), user: userData(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login for all roles
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !(await user.matchPassword(password || ''))) {
      return res.status(400).json({ message: 'Wrong email or password' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'This account is deactivated' });
    }
    // each login page only lets in its own kind of user
    if (role && user.role !== role) {
      return res.status(403).json({ message: `This is not a ${role} account. Please use the ${user.role} login page.` });
    }
    res.json({ token: makeToken(user._id), user: userData(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get the logged in user
exports.getMe = (req, res) => {
  res.json(userData(req.user));
};

// Update own name, phone and profile picture (picture is a small image data URL, empty text removes it)
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ message: 'Name cannot be empty' });
      req.user.name = name;
    }
    if (phone !== undefined) req.user.phone = phone;
    if (avatar !== undefined) {
      if (avatar && !avatar.startsWith('data:image/')) {
        return res.status(400).json({ message: 'Picture must be an image' });
      }
      req.user.avatar = avatar;
    }
    await req.user.save();
    res.json(userData(req.user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hash the reset token so the database never holds the real one
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// Email a password reset link (same reply whether or not the email exists)
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: (req.body.email || '').toLowerCase() });
    if (user && user.isActive) {
      const token = crypto.randomBytes(32).toString('hex');
      user.resetToken = hashToken(token);
      user.resetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
      await user.save();

      const link = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${token}`;
      await sendMail(user.email, 'Reset your password - QuickCare',
        `Hi ${user.name},\n\nWe got a request to reset your password. Open this link to choose a new one (valid for 30 minutes):\n${link}\n\nIf this was not you, just ignore this email.\n\nQuickCare`);
    }
    res.json({ message: 'If that email is registered, a reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Set a new password using the link from the email
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const user = await User.findOne({ resetToken: hashToken(req.params.token), resetExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'This reset link is invalid or has expired' });

    user.password = password;
    user.resetToken = '';
    user.resetExpires = undefined;
    await user.save();
    res.json({ message: 'Password changed. You can log in now.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
