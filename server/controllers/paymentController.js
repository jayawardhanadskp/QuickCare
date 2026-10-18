const Appointment = require('../models/Appointment');
const DoctorProfile = require('../models/DoctorProfile');
const { getFreeSlots } = require('../utils/slots');
const { notifyAppointment } = require('../utils/mailer');
const { toUsd, paypalRequest } = require('../utils/paypal');

// The client needs the public PayPal client id to show the buttons
const getConfig = (req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID || '' });
};

// Check the slot is still free and work out the price in USD
const checkBooking = async ({ doctor, date, time }) => {
  if (!doctor || !date || !time) return { error: 'Doctor, date and time are required' };
  const profile = await DoctorProfile.findOne({ user: doctor });
  if (!profile) return { error: 'Doctor not found' };
  const free = await getFreeSlots(doctor, date);
  if (!free.includes(time)) return { error: 'That time slot is not available' };
  return { usd: toUsd(profile.fee) };
};

// Step 1: create a PayPal order for the consultation fee
const createOrder = async (req, res) => {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return res.status(503).json({ message: 'Online payment is not set up yet' });
  }
  const { error, usd } = await checkBooking(req.body);
  if (error) return res.status(400).json({ message: error });

  const order = await paypalRequest('/v2/checkout/orders', {
    intent: 'CAPTURE',
    purchase_units: [{ description: 'QuickCare consultation', amount: { currency_code: 'USD', value: usd } }],
  });
  res.json({ id: order.id });
};

// Step 2: the patient approved the payment, take the money and book the slot
const captureOrder = async (req, res) => {
  const { orderId, reason } = req.body;
  if (!orderId) return res.status(400).json({ message: 'Order id is required' });

  // The same order must never book two appointments
  if (await Appointment.findOne({ paypalOrderId: orderId })) {
    return res.status(400).json({ message: 'This payment was already used' });
  }

  const { error, usd } = await checkBooking(req.body);
  if (error) return res.status(400).json({ message: error });

  const capture = await paypalRequest(`/v2/checkout/orders/${orderId}/capture`);
  const paid = capture.purchase_units?.[0]?.payments?.captures?.[0];
  if (capture.status !== 'COMPLETED' || !paid || paid.amount.value !== usd) {
    return res.status(400).json({ message: 'Payment was not completed' });
  }

  const { doctor, date, time } = req.body;
  const appointment = await Appointment.create({
    patient: req.user._id, doctor, date, time, reason, paid: true, paypalOrderId: orderId,
  });
  notifyAppointment(appointment, 'booked');
  res.status(201).json(appointment);
};

module.exports = { getConfig, createOrder, captureOrder };
