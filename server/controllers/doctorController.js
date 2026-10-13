const DoctorProfile = require('../models/DoctorProfile');
const Favourite = require('../models/Favourite');
const Review = require('../models/Review');
const { getFreeSlots } = require('../utils/slots');

// Add averageRating and reviewCount to doctor profiles
const withRatings = async (profiles) => {
  const stats = await Review.aggregate([
    { $group: { _id: '$doctor', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  return profiles.map((p) => {
    const s = stats.find((x) => String(x._id) === String(p.user._id));
    return { ...p.toObject(), averageRating: s ? Math.round(s.avg * 10) / 10 : 0, reviewCount: s ? s.count : 0 };
  });
};

// List doctors, with optional search (?q=) and specialization filter
const listDoctors = async (req, res) => {
  const { q, specialization } = req.query;
  const filter = {};
  if (specialization) filter.specialization = specialization;

  let doctors = await DoctorProfile.find(filter).populate('user', 'name email phone isActive');
  doctors = doctors.filter((d) => d.user && d.user.isActive);

  if (q) {
    const text = q.toLowerCase();
    doctors = doctors.filter((d) =>
      d.user.name.toLowerCase().includes(text) ||
      d.specialization.toLowerCase().includes(text) ||
      d.hospital.toLowerCase().includes(text));
  }
  res.json(await withRatings(doctors));
};

// One doctor by their user id
const getDoctor = async (req, res) => {
  const doctor = await DoctorProfile.findOne({ user: req.params.id }).populate('user', 'name email phone');
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  res.json((await withRatings([doctor]))[0]);
};

// Free slots for a doctor on ?date=YYYY-MM-DD
const getSlots = async (req, res) => {
  const { date, ignore } = req.query;
  if (!date) return res.status(400).json({ message: 'Date is required' });
  res.json(await getFreeSlots(req.params.id, date, ignore));
};

// The logged in doctor's own profile
const getMyProfile = async (req, res) => {
  const profile = await DoctorProfile.findOne({ user: req.user._id });
  res.json(profile);
};

// Doctor edits own profile and availability
const updateMyProfile = async (req, res) => {
  const { specialization, experience, fee, hospital, bio, availability } = req.body;
  if (!specialization) return res.status(400).json({ message: 'Specialization is required' });

  const profile = await DoctorProfile.findOneAndUpdate(
    { user: req.user._id },
    { specialization, experience, fee, hospital, bio, availability },
    { new: true, upsert: true, runValidators: true }
  );
  res.json(profile);
};

// Add or remove a favourite doctor
const toggleFavourite = async (req, res) => {
  const data = { patient: req.user._id, doctor: req.params.id };
  const existing = await Favourite.findOne(data);
  if (existing) {
    await existing.deleteOne();
    return res.json({ favourite: false });
  }
  await Favourite.create(data);
  res.json({ favourite: true });
};

// Ids of the patient's favourite doctors
const myFavourites = async (req, res) => {
  const favs = await Favourite.find({ patient: req.user._id });
  res.json(favs.map((f) => String(f.doctor)));
};

module.exports = { listDoctors, getDoctor, getSlots, getMyProfile, updateMyProfile, toggleFavourite, myFavourites };
