const router = require('express').Router();
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const c = require('../controllers/recordController');

router.use(protect);

router.get('/patients', allowRoles('doctor', 'admin'), c.myPatients);
router.get('/', c.listRecords);
router.post('/', c.addRecord);
router.put('/:id', c.updateRecord);
router.delete('/:id', allowRoles('admin'), c.deleteRecord);

module.exports = router;
