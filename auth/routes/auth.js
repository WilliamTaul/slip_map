import express from 'express';
import { register, login, logout, token } from '../controllers/authController.js'

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/token', token);

export default authRouter;