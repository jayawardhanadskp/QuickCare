const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: (process.env.EMAIL_PASS || '').replace(/\s/g, '') },
});

// Send one email. A mail problem must never break the request, so errors are only logged.
const sendMail = async (to, subject, text) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  try {
    await transporter.sendMail({ from: `QuickCare <${process.env.EMAIL_USER}>`, to, subject, text });
  } catch (err) {
    console.log('Email failed:', err.message);
  }
};

// Email both the patient and the doctor about an appointment
// action example: "booked", "rescheduled", "cancelled"
const notifyAppointment = async (appointment, action) => {
  const [patient, doctor] = await Promise.all([
    User.findById(appointment.patient),
    User.findById(appointment.doctor),
  ]);
  if (!patient || !doctor) return;

  const when = `${appointment.date} at ${appointment.time}`;
  const subject = `Appointment ${action} - QuickCare`;
  sendMail(patient.email, subject, `Hi ${patient.name},\n\nYour appointment with ${doctor.name} has been ${action}.\nDate and time: ${when}\n\nQuickCare`);
  sendMail(doctor.email, subject, `Hi ${doctor.name},\n\nAn appointment with ${patient.name} has been ${action}.\nDate and time: ${when}\n\nQuickCare`);
};

module.exports = { sendMail, notifyAppointment };
