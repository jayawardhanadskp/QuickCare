const router = require('express').Router();
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const c = require('../controllers/appointmentController');

router.use(protect);

router.post('/', allowRoles('patient'), c.bookAppointment);
router.get('/', c.myAppointments);
router.put('/:id/reschedule', c.reschedule);
router.put('/:id/cancel', c.cancel);
router.put('/:id/complete', allowRoles('doctor', 'admin'), c.complete);

module.exports = router;
