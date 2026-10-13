require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const DoctorProfile = require('./models/DoctorProfile');
const Appointment = require('./models/Appointment');
const Favourite = require('./models/Favourite');
const HealthRecord = require('./models/HealthRecord');
const Review = require('./models/Review');
const Faq = require('./models/Faq');
const Message = require('./models/Message');

// Demo users: run with "npm run seed"
const users = [
  { name: 'Admin', email: 'admin@quickcare.com', password: 'admin123', role: 'admin' },
  { name: 'Dr. Nimal Perera', email: 'nimal@quickcare.com', password: 'doctor123', role: 'doctor' },
  { name: 'Dr. Sanduni Silva', email: 'sanduni@quickcare.com', password: 'doctor123', role: 'doctor' },
  { name: 'Dr. Arun Kumar', email: 'arun@quickcare.com', password: 'doctor123', role: 'doctor' },
  { name: 'Dr. Ayesha Fernando', email: 'ayesha@quickcare.com', password: 'doctor123', role: 'doctor' },
  { name: 'Kasun Jayawardhana', email: 'kasun@example.com', password: 'patient123', role: 'patient' },
  { name: 'Hiruni Wickrama', email: 'hiruni@example.com', password: 'patient123', role: 'patient' },
  { name: 'Ravi Shankar', email: 'ravi@example.com', password: 'patient123', role: 'patient' },
];

// Profile details for each demo doctor
const week = (days, start, end) => days.map((day) => ({ day, start, end }));
const profiles = {
  'nimal@quickcare.com': { specialization: 'Cardiologist', experience: 15, fee: 3500, hospital: 'Colombo Heart Centre', bio: 'Heart specialist focusing on prevention and long term care.', availability: week(['Monday', 'Wednesday', 'Friday'], '09:00', '13:00') },
  'sanduni@quickcare.com': { specialization: 'Dermatologist', experience: 8, fee: 2500, hospital: 'Kandy Skin Clinic', bio: 'Treats skin, hair and nail conditions for all ages.', availability: week(['Tuesday', 'Thursday', 'Saturday'], '10:00', '14:00') },
  'arun@quickcare.com': { specialization: 'Paediatrician', experience: 12, fee: 3000, hospital: 'Jaffna Children Hospital', bio: 'Caring for babies, children and teenagers.', availability: week(['Monday', 'Tuesday', 'Thursday'], '14:00', '18:00') },
  'ayesha@quickcare.com': { specialization: 'General Physician', experience: 6, fee: 2000, hospital: 'Galle Family Clinic', bio: 'Family doctor for everyday health problems and check ups.', availability: week(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], '08:00', '12:00') },
};

// Sample FAQs shown on the public FAQ page
const faqs = [
  { question: 'How do I book an appointment?', answer: 'Create a patient account, open Find a doctor, choose a doctor, pick a date and time slot, then confirm the booking.' },
  { question: 'Can I change or cancel my appointment?', answer: 'Yes. Go to My appointments, then use Reschedule to pick a new slot or Cancel to remove the booking.' },
  { question: 'How do I pay the doctor fee?', answer: 'The fee is paid at the clinic on the day of your visit. Your receipt shows the fee for your records.' },
  { question: 'Who can see my health records?', answer: 'Only you, the doctors you have booked with, and the QuickCare admin team.' },
  { question: 'Which languages are supported?', answer: 'You can switch between English, Sinhala and Tamil using the language menu at the top of every page.' },
];

// A date a few days ago as YYYY-MM-DD
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User, DoctorProfile, Appointment, Favourite, HealthRecord, Review, Faq, Message].map((m) => m.deleteMany({})));
  for (const u of users) {
    const created = await User.create(u);
    if (profiles[u.email]) await DoctorProfile.create({ user: created._id, ...profiles[u.email] });
  }

  // Sample completed visits, reviews and health records
  const find = (email) => User.findOne({ email });
  const [kasun, hiruni, nimal, ayesha] = await Promise.all([
    find('kasun@example.com'), find('hiruni@example.com'), find('nimal@quickcare.com'), find('ayesha@quickcare.com'),
  ]);
  const visit1 = await Appointment.create({ patient: kasun._id, doctor: nimal._id, date: daysAgo(7), time: '09:00', reason: 'Chest discomfort check', status: 'completed' });
  await Appointment.create({ patient: hiruni._id, doctor: ayesha._id, date: daysAgo(3), time: '08:30', reason: 'Seasonal flu', status: 'completed' });
  // Older visits so the reports have more than one month of data
  const [ravi, sanduni, arun] = await Promise.all([find('ravi@example.com'), find('sanduni@quickcare.com'), find('arun@quickcare.com')]);
  await Appointment.create([
    { patient: ravi._id, doctor: sanduni._id, date: daysAgo(40), time: '10:00', reason: 'Skin rash', status: 'completed' },
    { patient: kasun._id, doctor: arun._id, date: daysAgo(65), time: '11:00', reason: 'Knee pain', status: 'completed' },
    { patient: ravi._id, doctor: nimal._id, date: daysAgo(20), time: '14:00', reason: 'Check-up', status: 'cancelled' },
  ]);
  // Loyalty points: 10 for each completed visit
  await User.updateOne({ _id: kasun._id }, { loyaltyPoints: 20 });
  await User.updateOne({ _id: hiruni._id }, { loyaltyPoints: 10 });
  await User.updateOne({ _id: ravi._id }, { loyaltyPoints: 10 });
  await Message.create([
    { sender: kasun._id, receiver: nimal._id, text: 'Hello doctor, should I keep taking the tablets after meals?' },
    { sender: nimal._id, receiver: kasun._id, text: 'Yes, after meals please. See you at the next review.' },
  ]);
  await Review.create({ appointment: visit1._id, patient: kasun._id, doctor: nimal._id, rating: 5, comment: 'Very clear explanation and no waiting time.' });
  await HealthRecord.create([
    { patient: kasun._id, createdBy: nimal._id, title: 'Mild hypertension', category: 'condition', details: 'Blood pressure 140/90. Reduce salt and review in 3 months.', date: daysAgo(7) },
    { patient: kasun._id, createdBy: kasun._id, title: 'Penicillin allergy', category: 'allergy', details: 'Rash after taking penicillin as a child.', date: daysAgo(30) },
    { patient: hiruni._id, createdBy: ayesha._id, title: 'Flu medication', category: 'medication', details: 'Paracetamol 500mg three times a day for 3 days.', date: daysAgo(3) },
  ]);
  await Faq.create(faqs);

  console.log('Seeded', users.length, 'users and', Object.keys(profiles).length, 'doctor profiles');
  process.exit();
};

run();
