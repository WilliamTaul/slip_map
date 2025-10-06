const express = require('express');
const path = require('path');
const cors = require('cors');
const io = require('socket.io')
const app = express();
const db = require('./db');
require('dotenv').config();

db();

app.use(cors({
    origin: ['http://localhost:3002', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use('/bootstrap', express.static(
    path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const userRouter = require('./routes/views/users');
const indexRouter = require('./routes/views/index');
const slipRouter = require('./routes/views/slip');
const apiSlipRouter = require('./routes/api/slipApi');
const messageRouter = require('./routes/api/messageRoutes');
const messageBoardRouter = require('./routes/api/messageBoardRoutes');

app.use('/users', userRouter);
app.use('/', indexRouter);
app.use('/slips', slipRouter);
app.use('/api/slips', apiSlipRouter);
app.use('/api/message', messageRouter);
app.use('/api/message-board', messageBoardRouter);

module.exports = app;