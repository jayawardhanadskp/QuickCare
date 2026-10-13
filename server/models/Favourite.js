const mongoose = require('mongoose');

// A patient's favourite doctor
const favouriteSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

favouriteSchema.index({ patient: 1, doctor: 1 }, { unique: true });

module.exports = mongoose.model('Favourite', favouriteSchema);
