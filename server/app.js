const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const db = require('./db');

db();

app.use(cors({
    origin: ['http://localhost:3002', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
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

app.use('/users', userRouter);
app.use('/', indexRouter);
app.use('/slips', slipRouter);
app.use('/api/slips', apiSlipRouter);

module.exports = app;