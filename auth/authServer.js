import express from 'express';
import db from './db.js';
import cors from 'cors';
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';

db();

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRouter);

app.listen(3001);