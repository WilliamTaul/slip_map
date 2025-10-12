const express = require('express');
const router = express.Router();
const controller = require('../../controllers/api/userProfileController');
const auth = require('../../middleware/auth');

router.get('/', auth.authenticateAdmin, controller.getUserProfiles);

router.get('/info', auth.authenticateToken, controller.getUserProfile);

router.post('/new', auth.authenticateToken, controller.createUserProfile);
router.post('/edit', auth.authenticateToken, controller.updateUserProfile);

module.exports = router;