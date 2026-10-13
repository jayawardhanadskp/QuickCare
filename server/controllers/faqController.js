const Faq = require('../models/Faq');

// All FAQs (public)
const listFaqs = async (req, res) => {
  res.json(await Faq.find().sort('createdAt'));
};

// Admin adds a FAQ
const addFaq = async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) return res.status(400).json({ message: 'Question and answer are required' });
  res.status(201).json(await Faq.create({ question, answer }));
};

// Admin edits a FAQ
const updateFaq = async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) return res.status(400).json({ message: 'Question and answer are required' });
  const faq = await Faq.findByIdAndUpdate(req.params.id, { question, answer }, { new: true });
  if (!faq) return res.status(404).json({ message: 'FAQ not found' });
  res.json(faq);
};

// Admin deletes a FAQ
const deleteFaq = async (req, res) => {
  const faq = await Faq.findByIdAndDelete(req.params.id);
  if (!faq) return res.status(404).json({ message: 'FAQ not found' });
  res.json({ message: 'FAQ deleted' });
};

module.exports = { listFaqs, addFaq, updateFaq, deleteFaq };
