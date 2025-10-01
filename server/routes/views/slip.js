const express = require('express');
const router = express.Router();
const controller = require('../../controllers/views/slipController')

router.get('', (req, res) => {
    res.render('slip');
});

router.get('/new', controller.showSlipForm);
router.post('/new', controller.handleSlipForm);
router.get('/list', controller.showSlips);
router.get('/map', controller.slipMap);

module.exports = router;