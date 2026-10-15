const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, enum: ['condition', 'allergy', 'medication', 'lab result', 'other'], default: 'other' },
  details: { type: String, default: '' },
  date: { type: String, required: true }, // YYYY-MM-DD
  // PDFs and images saved as data URLs
  attachments: [{ name: String, mimeType: String, data: String }],
}, { timestamps: true });

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
