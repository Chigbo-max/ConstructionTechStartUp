const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const bidController = require('../controllers/bidController');

const router = express.Router();

router.post('/create', authenticateToken, requireRole('CONTRACTOR'), bidController.create);
router.post('/assign', authenticateToken, requireRole('HOMEOWNER'), bidController.assign);

module.exports = router;