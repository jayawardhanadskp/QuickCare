const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');
const SupportMessage = require('./models/SupportMessage');
const { canChat } = require('./controllers/chatController');

// Live chat. Each user joins a room named after their own id.
const setupSocket = (httpServer) => {
  const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL } });

  // Only logged in users can connect
  io.use(async (socket, next) => {
    try {
      const decoded = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user || !user.isActive) return next(new Error('Account not available'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Not logged in'));
    }
  });

  io.on('connection', (socket) => {
    const myId = String(socket.user._id);
    socket.join(myId);
    if (socket.user.role === 'admin') socket.join('admins');

    // Support chat: a patient writes to the admins, an admin answers one patient
    socket.on('support', async ({ patient, text }) => {
      if (!text || !text.trim()) return;
      const isAdmin = socket.user.role === 'admin';
      if (!isAdmin && socket.user.role !== 'patient') return;
      const owner = isAdmin ? patient : myId;
      if (!owner) return;
      const message = await SupportMessage.create({ patient: owner, fromAdmin: isAdmin, text });
      io.to(String(owner)).to('admins').emit('support', message);
    });

    socket.on('send', async ({ to, text }) => {
      if (!text || !text.trim() || !(await canChat(myId, to))) return;
      const message = await Message.create({ sender: myId, receiver: to, text });
      io.to(myId).to(String(to)).emit('message', message);
    });
  });
};

module.exports = setupSocket;
