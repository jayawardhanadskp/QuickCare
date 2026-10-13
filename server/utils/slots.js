const DoctorProfile = require('../models/DoctorProfile');
const Appointment = require('../models/Appointment');

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SLOT_MINUTES = 30;

// "09:30" -> 570
const toMinutes = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

// 570 -> "09:30"
const toTime = (mins) => {
  const h = String(Math.floor(mins / 60)).padStart(2, '0');
  const m = String(mins % 60).padStart(2, '0');
  return `${h}:${m}`;
};

// Is this date and time already over?
const isPast = (date, time) => new Date(`${date}T${time}:00`) < new Date();

// All free 30 minute slots of a doctor on a date.
// ignoreId lets a patient keep their own slot while rescheduling.
const getFreeSlots = async (doctorId, date, ignoreId) => {
  const profile = await DoctorProfile.findOne({ user: doctorId });
  if (!profile) return [];

  const dayName = DAYS[new Date(`${date}T00:00:00`).getDay()];
  const booked = await Appointment.find({ doctor: doctorId, date, status: { $ne: 'cancelled' } });
  const taken = booked.filter((a) => String(a._id) !== String(ignoreId)).map((a) => a.time);

  const slots = [];
  profile.availability.filter((a) => a.day === dayName).forEach((a) => {
    for (let t = toMinutes(a.start); t + SLOT_MINUTES <= toMinutes(a.end); t += SLOT_MINUTES) {
      const time = toTime(t);
      if (!taken.includes(time) && !isPast(date, time)) slots.push(time);
    }
  });
  return slots.sort();
};

module.exports = { getFreeSlots, isPast, DAYS };
