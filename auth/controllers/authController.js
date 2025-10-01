import 'dotenv/config'

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import RefreshToken from '../models/refreshToken.js';
import User from '../models/user.js';

const register = async (req, res) => {
    if (req.body.password.length < 8) return res.status(409).json({ message: "Password must be at least 8 characters" })

    try {
        const existingUser = await User.findOne({username: req.body.username});
        if (existingUser) return res.status(409).json({ message: 'Username already taken'});

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({username: req.body.username, password: hashedPassword});
        await user.save();
        
        const token = jwt.sign({id: user._id}, process.env.SECRET_TOKEN);
        const refreshToken = jwt.sign({id: user._id}, process.env.REFRESH_TOKEN);
        res.status(201).json({ token: token, refreshToken: refreshToken })
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).send('Server Error');
    }
}

const login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        if (await bcrypt.compare(req.body.password, user.password)) {
            await RefreshToken.deleteMany({ userId: user.id });
            const token = jwt.sign({id: user._id}, process.env.SECRET_TOKEN);
            const refreshTokenString = jwt.sign({id: user._id}, process.env.REFRESH_TOKEN);
            const refreshToken = new RefreshToken({token: refreshTokenString, userId: user._id});
            await refreshToken.save();
            res.status(200).json({ token: token, refreshToken: refreshTokenString})
        } else {
            return res.status(401).json({ message: 'Invalid credentials'});
        }
    } catch (err) {
        console.error('Login error: ', err);
        res.status(500).json({ message: 'Server error during login' });
    }
}

const logout = async (req, res) => {
    try {
        await RefreshToken.deleteOne({ token: req.body.token });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error: ", err);
        res.status(500).json({ message: 'Server error during logout' });
    }
}

const token = async (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.status(401).json({ message: 'Unauthorized' });

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, payload) => {
            if (err) return res.status(403).json({ message: 'Forbidden'});
        })
        const storedToken = await RefreshToken.findOne({ token: refreshToken });
        if (!storedToken) return res.status(403).json({ message: 'Forbidden' });

        await RefreshToken.deleteOne({ token: refreshToken });
        
        const newToken = jwt.sign({ id: payload.id }, process.env.SECRET_TOKEN);
        const newRefreshToken= jwt.sign({ id: payload.id }, process.env.REFRESH_TOKEN);
        
        await new RefreshToken({ token: newRefreshToken, userId: payload.id }).save();

        res.status(200).json({ token: newToken, refreshToken: newRefreshToken});

    } catch (err) {
        console.error('Token refresh error: ', err);
        return res.status(500).json({ message: 'Server error during token refresh' });
    } 

}

export { register, login, logout, token }