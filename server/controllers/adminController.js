const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const Appointment = require('../models/Appointment');
const Favourite = require('../models/Favourite');
const HealthRecord = require('../models/HealthRecord');
const Review = require('../models/Review');
const Message = require('../models/Message');

// Numbers for the admin dashboard and reports
const stats = async (req, res) => {
  const [users, appointments, profiles] = await Promise.all([
    User.find().select('role'),
    Appointment.find().lean(),
    DoctorProfile.find().populate('user', 'name').lean(),
  ]);

  const count = (role) => users.filter((u) => u.role === role).length;
  const byStatus = (s) => appointments.filter((a) => a.status === s).length;
  const profileOf = (doctorId) => profiles.find((p) => String(p.user._id) === String(doctorId));

  // Appointments in each of the last 6 months
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months.push({ month: key, appointments: appointments.filter((a) => a.date.startsWith(key)).length });
  }

  // Appointments per specialization and completed visits per doctor
  const specCount = {};
  const doctorCount = {};
  let revenue = 0;
  appointments.forEach((a) => {
    const p = profileOf(a.doctor);
    if (!p) return;
    specCount[p.specialization] = (specCount[p.specialization] || 0) + 1;
    if (a.status === 'completed') {
      doctorCount[p.user.name] = (doctorCount[p.user.name] || 0) + 1;
      revenue += p.fee;
    }
  });

  res.json({
    patients: count('patient'),
    doctors: count('doctor'),
    appointments: appointments.length,
    booked: byStatus('booked'),
    completed: byStatus('completed'),
    cancelled: byStatus('cancelled'),
    revenue,
    months,
    specializations: Object.entries(specCount).map(([name, value]) => ({ name, value })),
    topDoctors: Object.entries(doctorCount).map(([name, visits]) => ({ name, visits }))
      .sort((a, b) => b.visits - a.visits).slice(0, 5),
  });
};

// List users, optionally only one role (?role=doctor)
const listUsers = async (req, res) => {
  const filter = req.query.role ? { role: req.query.role } : {};
  const users = await User.find(filter).select('-password -avatar').sort('name').lean();

  // Attach the specialization to doctors
  const profiles = await DoctorProfile.find();
  users.forEach((u) => {
    const p = profiles.find((x) => String(x.user) === String(u._id));
    if (p) u.specialization = p.specialization;
  });
  res.json(users);
};

// Admin creates a doctor account with a basic profile
const createDoctor = async (req, res) => {
  const { name, email, password, phone, specialization, fee, hospital } = req.body;
  if (!name || !email || !password || !specialization) {
    return res.status(400).json({ message: 'Name, email, password and specialization are required' });
  }
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  if (await User.findOne({ email: email.toLowerCase() })) {
    return res.status(400).json({ message: 'Email is already registered' });
  }

  const user = await User.create({ name, email, password, phone, role: 'doctor' });
  await DoctorProfile.create({ user: user._id, specialization, fee: fee || 0, hospital });
  res.status(201).json({ _id: user._id, name: user.name });
};

// Activate or deactivate an account
const toggleActive = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'admin') return res.status(400).json({ message: 'Admin accounts cannot be changed here' });

  user.isActive = !user.isActive;
  await user.save();
  res.json({ isActive: user.isActive });
};

// Delete a user together with their related data
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'admin') return res.status(400).json({ message: 'Admin accounts cannot be deleted' });

  const id = user._id;
  await Promise.all([
    Appointment.deleteMany({ $or: [{ patient: id }, { doctor: id }] }),
    Favourite.deleteMany({ $or: [{ patient: id }, { doctor: id }] }),
    HealthRecord.deleteMany({ patient: id }),
    Review.deleteMany({ $or: [{ patient: id }, { doctor: id }] }),
    Message.deleteMany({ $or: [{ sender: id }, { receiver: id }] }),
    DoctorProfile.deleteOne({ user: id }),
  ]);
  await user.deleteOne();
  res.json({ message: 'User deleted' });
};

// Add or remove loyalty points of a patient (change can be negative)
const changePoints = async (req, res) => {
  const change = Number(req.body.change);
  if (!change) return res.status(400).json({ message: 'Enter a number of points' });

  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'patient') return res.status(404).json({ message: 'Patient not found' });

  user.loyaltyPoints = Math.max(0, user.loyaltyPoints + change);
  await user.save();
  res.json({ loyaltyPoints: user.loyaltyPoints });
};

module.exports = { stats, listUsers, createDoctor, toggleActive, deleteUser, changePoints };
