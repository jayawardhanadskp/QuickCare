const SupportMessage = require('../models/SupportMessage');

// Patient: their own support chat
const mine = async (req, res) => {
  res.json(await SupportMessage.find({ patient: req.user._id }).sort('createdAt'));
};

// Admin: one entry per patient who wrote in, newest first
const conversations = async (req, res) => {
  const list = await SupportMessage.aggregate([
    { $sort: { createdAt: -1 } },
    { $group: { _id: '$patient', last: { $first: '$text' }, lastAt: { $first: '$createdAt' }, fromAdmin: { $first: '$fromAdmin' } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'patient' } },
    { $unwind: '$patient' },
    { $project: { last: 1, lastAt: 1, fromAdmin: 1, 'patient.name': 1 } },
    { $sort: { lastAt: -1 } },
  ]);
  res.json(list);
};

// Admin: the messages of one patient
const history = async (req, res) => {
  res.json(await SupportMessage.find({ patient: req.params.patientId }).sort('createdAt'));
};

module.exports = { mine, conversations, history };
