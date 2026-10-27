const router = require('express').Router();
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const c = require('../controllers/paymentController');

router.use(protect, allowRoles('patient'));

router.get('/config', c.getConfig);
router.post('/create-order', c.createOrder);
router.post('/capture-order', c.captureOrder);

module.exports = router;
