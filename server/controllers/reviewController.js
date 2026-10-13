const Review = require('../models/Review');
const Appointment = require('../models/Appointment');

// Patient reviews a completed appointment (one review each)
const addReview = async (req, res) => {
  const { appointment: appointmentId, rating, comment } = req.body;
  if (!appointmentId || !rating) return res.status(400).json({ message: 'Appointment and rating are required' });
  if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment || String(appointment.patient) !== String(req.user._id)) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  if (appointment.status !== 'completed') return res.status(400).json({ message: 'You can review after the visit is completed' });
  if (await Review.exists({ appointment: appointmentId })) return res.status(400).json({ message: 'You already reviewed this visit' });

  const review = await Review.create({
    appointment: appointmentId, patient: req.user._id, doctor: appointment.doctor, rating, comment,
  });
  res.status(201).json(review);
};

// Reviews of one doctor (public)
const doctorReviews = async (req, res) => {
  const reviews = await Review.find({ doctor: req.params.id }).populate('patient', 'name').sort('-createdAt');
  res.json(reviews);
};

// Reviews received (doctor) or written (patient) by the logged in user
const myReviews = async (req, res) => {
  const filter = req.user.role === 'doctor' ? { doctor: req.user._id } : { patient: req.user._id };
  const reviews = await Review.find(filter).populate('patient', 'name').sort('-createdAt');
  res.json(reviews);
};

module.exports = { addReview, doctorReviews, myReviews };
