const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Create a token that lasts 7 days
const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// What we send back to the client (never the password)
const userData = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role, phone: u.phone, loyaltyPoints: u.loyaltyPoints });

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
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !(await user.matchPassword(password || ''))) {
      return res.status(400).json({ message: 'Wrong email or password' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'This account is deactivated' });
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
