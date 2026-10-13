const express = require('express');
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const { stats, listUsers, createDoctor, toggleActive, deleteUser, changePoints } = require('../controllers/adminController');

const router = express.Router();

router.use(protect, allowRoles('admin'));
router.get('/stats', stats);
router.get('/users', listUsers);
router.post('/doctors', createDoctor);
router.put('/users/:id/active', toggleActive);
router.put('/users/:id/points', changePoints);
router.delete('/users/:id', deleteUser);

module.exports = router;
