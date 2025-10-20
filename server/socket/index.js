const jwt = require('jsonwebtoken');
const Message = require('../models/messageSchema');
const MessageBoard = require('../models/messageBoardSchema');
const mongoose = require('mongoose');

module.exports = function (io) {
    io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error("Authentication error: Token missing!"));
    }

    jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
        if (err) {
            console.warn('Socket JWT verification failed: ', err.message);
            return next(new Error("Authentication error: Invalid or expired token"));
        }

        socket.user = user;
        next();
    })
})
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        })

        socket.on('joinBoard', async (board) => {
            try {
                const found = await MessageBoard.findOne({ _id: board.boardId, users: board.senderId });
                if (found) {
                    socket.join(board.boardId);
                }
            } catch (err) {
                console.error("User not authorized for message board", err);
            }
        })

        socket.on('chatMessage', async (msg) => {
            const boardId = msg.boardId;
            if (!socket.rooms.has(boardId)) {
                socket.join(boardId);
            }
            let saved;
            try {
                saved = await Message.create({senderId: msg.senderId, content: msg.content, 
                                            boardId: new mongoose.Types.ObjectId(msg.boardId),
                                           firstName: msg.firstName});
            } catch (err) {
                console.error("Did not save message: ", err);
            }
            console.log('Received message: ', msg);
            io.to(msg.boardId).emit('chatMessage', saved);
        })
    });
};