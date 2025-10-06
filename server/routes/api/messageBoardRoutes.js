const express = require('express');
const router = express.Router();
const controller = require('../../controllers/api/messageBoardController');
const auth = require('../../middleware/auth');

router.get('', auth.authenticateAdmin, controller.getMessageBoards);
router.post('/new', auth.authenticateAdmin, controller.newMessageBoard);
router.delete('delete', auth.authenticateAdmin, controller.deleteMessageBoard);
router.post('/add-user', auth.authenticateAdmin, controller.messageBoardAddUser);
router.delete('remove-user', auth.authenticateAdmin, controller.messageBoardRemoveUser);

router.get('/display', auth.authenticateToken, controller.getMessageBoard);
router.get('/user', auth.authenticateToken, controller.getUserBoards);

module.exports = router;
