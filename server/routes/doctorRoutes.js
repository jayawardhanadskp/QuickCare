const router = require('express').Router();
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const c = require('../controllers/doctorController');

router.get('/', c.listDoctors);
router.get('/me/profile', protect, allowRoles('doctor'), c.getMyProfile);
router.put('/me/profile', protect, allowRoles('doctor'), c.updateMyProfile);
router.get('/favourites/mine', protect, allowRoles('patient'), c.myFavourites);
router.get('/:id', c.getDoctor);
router.get('/:id/slots', c.getSlots);
router.post('/:id/favourite', protect, allowRoles('patient'), c.toggleFavourite);

module.exports = router;
