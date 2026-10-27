const Appointment = require('../models/Appointment');
const DoctorProfile = require('../models/DoctorProfile');
const { getFreeSlots } = require('../utils/slots');
const User = require('../models/User');
const { notifyAppointment } = require('../utils/mailer');

// Fill doctor and patient names in the result
const withNames = (query) => query.populate('doctor', 'name email').populate('patient', 'name email phone');

// Patient books a slot
const bookAppointment = async (req, res) => {
  const { doctor, date, time, reason } = req.body;
  if (!doctor || !date || !time) return res.status(400).json({ message: 'Doctor, date and time are required' });

  const free = await getFreeSlots(doctor, date);
  if (!free.includes(time)) return res.status(400).json({ message: 'That time slot is not available' });

  // Doctors with a fee are booked through the PayPal checkout instead
  const profile = await DoctorProfile.findOne({ user: doctor });
  if (profile && profile.fee > 0) return res.status(400).json({ message: 'Please pay the consultation fee to book' });

  const appointment = await Appointment.create({ patient: req.user._id, doctor, date, time, reason });
  notifyAppointment(appointment, 'booked');
  res.status(201).json(appointment);
};

// Appointments of the logged in user (admin sees all)
const myAppointments = async (req, res) => {
  const filter = {};
  if (req.user.role === 'patient') filter.patient = req.user._id;
  if (req.user.role === 'doctor') filter.doctor = req.user._id;

  const list = await withNames(Appointment.find(filter).sort({ date: -1, time: -1 })).lean();

  // Add the doctor's fee and specialization (used for the receipt)
  const profiles = await DoctorProfile.find({ user: { $in: list.map((a) => a.doctor._id) } });
  list.forEach((a) => {
    const p = profiles.find((x) => String(x.user) === String(a.doctor._id));
    a.fee = p ? p.fee : 0;
    a.specialization = p ? p.specialization : '';
  });
  res.json(list);
};

// Find an appointment the user is allowed to touch
const findOwn = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404).json({ message: 'Appointment not found' });
    return null;
  }
  const isOwner = String(appointment.patient) === String(req.user._id);
  const isDoctor = String(appointment.doctor) === String(req.user._id);
  if (!isOwner && !isDoctor && req.user.role !== 'admin') {
    res.status(403).json({ message: 'You do not have access to this' });
    return null;
  }
  return appointment;
};

// Patient moves a booked appointment to a new slot
const reschedule = async (req, res) => {
  const appointment = await findOwn(req, res);
  if (!appointment) return;
  if (String(appointment.patient) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only the patient can reschedule' });
  }
  if (appointment.status !== 'booked') return res.status(400).json({ message: 'Only booked appointments can be changed' });

  const { date, time } = req.body;
  const free = await getFreeSlots(appointment.doctor, date, appointment._id);
  if (!free.includes(time)) return res.status(400).json({ message: 'That time slot is not available' });

  appointment.date = date;
  appointment.time = time;
  await appointment.save();
  notifyAppointment(appointment, 'rescheduled');
  res.json(appointment);
};

// Cancel a booked appointment (patient, doctor or admin)
const cancel = async (req, res) => {
  const appointment = await findOwn(req, res);
  if (!appointment) return;
  if (appointment.status !== 'booked') return res.status(400).json({ message: 'Only booked appointments can be cancelled' });

  appointment.status = 'cancelled';
  await appointment.save();
  notifyAppointment(appointment, 'cancelled');
  res.json(appointment);
};

// Doctor or admin marks an appointment as completed
const complete = async (req, res) => {
  const appointment = await findOwn(req, res);
  if (!appointment) return;
  if (req.user.role === 'patient') return res.status(403).json({ message: 'You do not have access to this' });
  if (appointment.status !== 'booked') return res.status(400).json({ message: 'Only booked appointments can be completed' });

  appointment.status = 'completed';
  await appointment.save();
  // Patient earns 10 loyalty points for each completed visit
  await User.findByIdAndUpdate(appointment.patient, { $inc: { loyaltyPoints: 10 } });
  res.json(appointment);
};

module.exports = { bookAppointment, myAppointments, reschedule, cancel, complete };
