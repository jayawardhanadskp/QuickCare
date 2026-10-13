const express = require('express');
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const { contacts, history } = require('../controllers/chatController');

const router = express.Router();

router.use(protect, allowRoles('patient', 'doctor'));
router.get('/contacts', contacts);
router.get('/:userId', history);

module.exports = router;
