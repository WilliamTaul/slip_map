const express = require('express');
const router = express.Router();
const controller = require('../../controllers/api/messageController');
const authenticateToken = require('../../middleware/auth');

router.get('', controller.getMessages);

router.post('/new', authenticateToken, controller.newMessage);

module.exports = router;