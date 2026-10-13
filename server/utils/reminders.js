const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const { sendMail } = require('./mailer');

// Today + 1 day as YYYY-MM-DD
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Email every patient who has a booked appointment tomorrow
const sendReminders = async () => {
  const list = await Appointment.find({ date: tomorrow(), status: 'booked' })
    .populate('patient', 'name email').populate('doctor', 'name');
  for (const a of list) {
    await sendMail(a.patient.email, 'Appointment reminder - QuickCare',
      `Hi ${a.patient.name},\n\nThis is a reminder of your appointment with ${a.doctor.name} tomorrow (${a.date}) at ${a.time}.\n\nQuickCare`);
  }
  console.log(`Reminders sent: ${list.length}`);
};

// Run every day at 8:00 AM
const startReminders = () => cron.schedule('0 8 * * *', sendReminders);

module.exports = { startReminders, sendReminders };
