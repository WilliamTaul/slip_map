const express = require('express');
const router = express.Router();
const controller = require('../../controllers/api/messageController');
const auth = require('../../middleware/auth');

router.get('', controller.getMessages);

router.post('/new', auth.authenticateToken, controller.newMessage);

module.exports = router;