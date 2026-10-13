const HealthRecord = require('../models/HealthRecord');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Can this user see and write the records of this patient?
const canAccessPatient = async (user, patientId) => {
  if (user.role === 'admin') return true;
  if (user.role === 'patient') return String(user._id) === String(patientId);
  // a doctor needs at least one appointment with the patient
  return !!(await Appointment.exists({ doctor: user._id, patient: patientId }));
};

// Patients the doctor has seen (admin gets every patient)
const myPatients = async (req, res) => {
  if (req.user.role === 'admin') {
    return res.json(await User.find({ role: 'patient' }).select('name email phone').sort('name'));
  }
  const ids = await Appointment.distinct('patient', { doctor: req.user._id });
  res.json(await User.find({ _id: { $in: ids } }).select('name email phone').sort('name'));
};

// Records of a patient (?patient=id). Patients always get their own.
const listRecords = async (req, res) => {
  const patientId = req.user.role === 'patient' ? req.user._id : req.query.patient;
  if (!patientId) return res.status(400).json({ message: 'Choose a patient' });
  if (!(await canAccessPatient(req.user, patientId))) {
    return res.status(403).json({ message: 'You do not have access to this patient' });
  }
  const records = await HealthRecord.find({ patient: patientId })
    .populate('createdBy', 'name role').sort({ date: -1, createdAt: -1 });
  res.json(records);
};

// Add a record
const addRecord = async (req, res) => {
  const { title, category, details, date } = req.body;
  const patientId = req.user.role === 'patient' ? req.user._id : req.body.patient;
  if (!patientId || !title || !date) return res.status(400).json({ message: 'Patient, title and date are required' });
  if (!(await canAccessPatient(req.user, patientId))) {
    return res.status(403).json({ message: 'You do not have access to this patient' });
  }
  const record = await HealthRecord.create({ patient: patientId, createdBy: req.user._id, title, category, details, date });
  res.status(201).json(record);
};

// Edit a record. Patients can only edit entries they added themselves.
const updateRecord = async (req, res) => {
  const record = await HealthRecord.findById(req.params.id);
  if (!record) return res.status(404).json({ message: 'Record not found' });
  if (!(await canAccessPatient(req.user, record.patient))) {
    return res.status(403).json({ message: 'You do not have access to this record' });
  }
  if (req.user.role === 'patient' && String(record.createdBy) !== String(req.user._id)) {
    return res.status(403).json({ message: 'You can only edit your own entries' });
  }
  const { title, category, details, date } = req.body;
  if (title) record.title = title;
  if (category) record.category = category;
  if (date) record.date = date;
  if (details !== undefined) record.details = details;
  await record.save();
  res.json(record);
};

// Admin deletes a record
const deleteRecord = async (req, res) => {
  const record = await HealthRecord.findById(req.params.id);
  if (!record) return res.status(404).json({ message: 'Record not found' });
  await record.deleteOne();
  res.json({ message: 'Record deleted' });
};

module.exports = { myPatients, listRecords, addRecord, updateRecord, deleteRecord };
