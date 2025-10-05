const jwt = require('jsonwebtoken');

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
    });
};