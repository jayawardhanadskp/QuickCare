require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const setupSocket = require('./socket');
const { startReminders } = require('./utils/reminders');

const app = express();
const server = http.createServer(app);
setupSocket(server);

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json({ limit: '1mb' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/faqs', require('./routes/faqRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

app.get('/', (req, res) => res.send('QuickCare API is running'));

// Any error that was not handled in a controller ends up here
app.use((err, req, res, next) => {
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  console.log(err.message);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  startReminders();
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
