import express from 'express';
import { register, login, logout, token, updateRole } from '../controllers/authController.js'

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/token', token);
authRouter.post('/update-role', updateRole);

export default authRouter;