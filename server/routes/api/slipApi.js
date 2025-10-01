const express = require('express');
const router = express.Router();
const controller = require('../../controllers/api/slipControllerApi');

router.get('', controller.getSlips);
router.post('/new', controller.newSlip);

module.exports = router;