const express = require('express');
const router = express.Router();
const controller = require('../../controllers/api/messageBoardController');
const auth = require('../../middleware/auth');

router.get('/', auth.authenticateAdmin, controller.getMessageBoards);
router.post('/new', auth.authenticateAdmin, controller.newMessageBoard);
router.delete('/delete/:id', auth.authenticateAdmin, controller.deleteMessageBoard);
router.post('/add-user', auth.authenticateAdmin, controller.messageBoardAddUser);
router.delete('/remove-user/:boardid/:userid', auth.authenticateAdmin, controller.messageBoardRemoveUser);

router.get('/user', auth.authenticateToken, controller.getUserBoards);
router.get('/:boardId', auth.authenticateToken, controller.getMessageBoard);
router.get('/:boardId/messages', auth.authenticateToken, controller.messageBoardGetMessages);

module.exports = router;
