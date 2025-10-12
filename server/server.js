const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const socketHandler = require('./socket/index');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3002',],
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

socketHandler(io);

server.listen(3000);
