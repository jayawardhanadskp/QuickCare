const mongoose = require('mongoose');

// One message in a patient's support chat with the admin team
const supportMessageSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // owner of the conversation
  fromAdmin: { type: Boolean, default: false },
  text: { type: String, required: true, trim: true, maxlength: 1000 },
}, { timestamps: true });

module.exports = mongoose.model('SupportMessage', supportMessageSchema);
