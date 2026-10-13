const Appointment = require('../models/Appointment');
const Message = require('../models/Message');
const User = require('../models/User');

// Patient and doctor can chat only when they share an appointment
const canChat = async (userA, userB) => {
  const count = await Appointment.countDocuments({
    $or: [{ patient: userA, doctor: userB }, { patient: userB, doctor: userA }],
  });
  return count > 0;
};

// People the logged in user can chat with
const contacts = async (req, res) => {
  if (req.user.role === 'admin') return res.json([]);
  const field = req.user.role === 'patient' ? 'doctor' : 'patient';
  const mine = req.user.role === 'patient' ? 'patient' : 'doctor';
  const ids = await Appointment.distinct(field, { [mine]: req.user._id });
  res.json(await User.find({ _id: { $in: ids } }).select('name role').sort('name'));
};

// Old messages with one person
const history = async (req, res) => {
  if (!(await canChat(req.user._id, req.params.userId))) {
    return res.status(403).json({ message: 'You can only chat after an appointment' });
  }
  const me = req.user._id;
  const other = req.params.userId;
  const messages = await Message.find({
    $or: [{ sender: me, receiver: other }, { sender: other, receiver: me }],
  }).sort('createdAt');
  res.json(messages);
};

module.exports = { canChat, contacts, history };
