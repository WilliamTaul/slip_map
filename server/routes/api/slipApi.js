const express = require('express');
const router = express.Router();
const controller = require('../../controllers/api/slipControllerApi');
const authenticateToken = require('../../middleware/auth')

router.get('', authenticateToken, controller.getSlips);
router.post('/new', controller.newSlip);

module.exports = router;