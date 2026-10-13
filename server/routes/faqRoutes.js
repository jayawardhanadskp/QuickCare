const router = require('express').Router();
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const c = require('../controllers/faqController');

router.get('/', c.listFaqs);
router.post('/', protect, allowRoles('admin'), c.addFaq);
router.put('/:id', protect, allowRoles('admin'), c.updateFaq);
router.delete('/:id', protect, allowRoles('admin'), c.deleteFaq);

module.exports = router;
