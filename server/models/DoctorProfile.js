const mongoose = require('mongoose');

// Extra details for users with the doctor role
const doctorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialization: { type: String, required: true },
  experience: { type: Number, default: 0 },
  fee: { type: Number, default: 0 },
  hospital: { type: String, default: '' },
  bio: { type: String, default: '' },
  // Weekly working hours, e.g. { day: 'Monday', start: '09:00', end: '13:00' }
  availability: [{ day: String, start: String, end: String }],
});

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);
