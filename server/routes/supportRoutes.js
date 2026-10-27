const router = require('express').Router();
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const c = require('../controllers/supportController');

router.use(protect);

router.get('/mine', allowRoles('patient'), c.mine);
router.get('/conversations', allowRoles('admin'), c.conversations);
router.get('/:patientId', allowRoles('admin'), c.history);

module.exports = router;
