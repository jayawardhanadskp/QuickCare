const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:MM
  reason: { type: String, default: '' },
  status: { type: String, enum: ['booked', 'completed', 'cancelled'], default: 'booked' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
