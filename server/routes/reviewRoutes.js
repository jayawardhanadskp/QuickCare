const router = require('express').Router();
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const c = require('../controllers/reviewController');

router.get('/doctor/:id', c.doctorReviews);
router.get('/mine', protect, allowRoles('doctor', 'patient'), c.myReviews);
router.post('/', protect, allowRoles('patient'), c.addReview);

module.exports = router;
