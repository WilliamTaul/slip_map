const jwt = require('jsonwebtoken');
const Message = require('../models/messageSchema');
const messageBoardSchema = require('../models/messageBoardSchema');
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

        socket.on('chatMessage', async (msg) => {
            socket.join(msg.boardId);
            console.log('Received message: ', msg.content);
            io.to(msg.boardId).emit('chatMessage', msg);

            try {
                const saved = await Message.create({senderId: msg.senderId, content: msg.content, boardId: new mongoose.Types.ObjectId(msg.boardId)});
            } catch (err) {
                console.error("Did not save message: ", err);
            }
        })
    });
};