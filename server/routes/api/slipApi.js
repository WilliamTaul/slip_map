const express = require('express');
const router = express.Router();
const controller = require('../../controllers/api/slipControllerApi');
const auth = require('../../middleware/auth')

router.get('', auth.authenticateToken, controller.getSlips);
router.post('/new', controller.newSlip);

module.exports = router;