import 'dotenv/config';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import RefreshToken from '../models/refreshToken.js';
import User from '../models/user.js';

const register = async (req, res) => {
    const errors = {};
    if (req.body.password.length < 8) {
        errors.password = "Password must be at least 8 characters!"; 
    }
    if (req.body.password !== req.body.matchPassword) {
        errors.password = "Password must match!";
    }

    if (Object.keys(errors).length > 0) return res.status(400).json({ errors: errors })

    try {
        const existingUser = await User.findOne({username: req.body.username.toLowerCase()});
        if (existingUser) return res.status(409).json({ errors: { username: "Username already taken!" }, message: 'Username already taken'});

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({username: req.body.username.toLowerCase(), password: hashedPassword});
        await user.save();
        
        const token = jwt.sign({id: user._id, role: user.role}, process.env.SECRET_TOKEN, {
            expiresIn: '15m'
        });
        const refreshToken = jwt.sign({id: user._id, role: user.role}, process.env.REFRESH_TOKEN, {
            expiresIn: '7d'
        });
        const newRefreshToken = new RefreshToken({token: refreshToken, userId: user._id});
        await newRefreshToken.save();
        res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/auth/',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        res.status(201).json({ token: token})
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).send('Server Error');
    }
}

const login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username.toLowerCase() });
        if (!user) return res.status(401).json({ error: {login: "Invalid username/password"} });
        if (await bcrypt.compare(req.body.password, user.password)) {
            await RefreshToken.deleteMany({ userId: user.id });
            const token = jwt.sign({id: user._id, role: user.role}, process.env.SECRET_TOKEN, {
                expiresIn: '15m'
            });
            const refreshTokenString = jwt.sign({id: user._id, role: user.role}, process.env.REFRESH_TOKEN, {
                expiresIn: '7d'
            });
            const refreshToken = new RefreshToken({token: refreshTokenString, userId: user._id});
            await refreshToken.save();
            res.cookie('refreshToken', refreshTokenString, {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                path: '/auth/',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            res.status(200).json({ token: token})
        } else {
            return res.status(401).json({ error: {login: "Invalid username/password"}});
        }
    } catch (err) {
        console.error('Login error: ', err);
        res.status(500).json({ message: 'Server error during login' });
    }
}

const logout = async (req, res) => {
    try {
        const result = await RefreshToken.deleteOne({ token: req.cookies.refreshToken });
        if (result.deletedCount === 0) {
            console.log("No refresh token was found to be deleted!");
        }
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            path: '/auth/'
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error: ", err);
        res.status(500).json({ message: 'Server error during logout' });
    }
}

function verifyJwtAsync(token, secret) {
    // jwt verify must be wrapped in a promise to be awaited in the
    // token function properly 
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    } catch (err) {
      reject(err);
    }
  });
}


const token = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken == null) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const payload = await verifyJwtAsync(refreshToken, process.env.REFRESH_TOKEN);
        const storedToken = await RefreshToken.findOne({ token: refreshToken });
        if (!storedToken) return res.status(403).json({ message: 'Forbidden' });

        const newToken = jwt.sign({ id: payload.id, role: payload.role }, process.env.SECRET_TOKEN, {
            expiresIn: '15m'
        });
        const newRefreshToken= jwt.sign({ id: payload.id, role: payload.role }, process.env.REFRESH_TOKEN, {
            expiresIn: '7d'
        });
        
        await RefreshToken.deleteOne({ token: refreshToken });
        await RefreshToken.findOneAndUpdate({ token: newRefreshToken }, { userId: payload.id }, { upsert: true });

        res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/auth/'
            });
        res.status(200).json({ token: newToken});

    } catch (err) {
    console.error('Token refresh error:', err);
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }
        return res.status(500).json({ message: 'Server error during token refresh' });
    }
}

const updateRole = async (req, res) => {
    const allowedRoles = ['admin', 'user'];

    if (!req.body.role) return res.status(400).json({message: "No role provided"});
    if (!allowedRoles.includes(req.body.role)) return res.status(404).json({message: "bad role"});

    try {
        console.log("entering try statement")
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken == null) return res.status(401).json({message: "bad token"});
        const payload = await verifyJwtAsync(refreshToken, process.env.REFRESH_TOKEN);
        const storedToken = await RefreshToken.findOne({ token: refreshToken });
        if (!storedToken) return res.status(403).json({ message: 'Forbidden' });

        const updated = await User.updateOne({ _id: payload.id }, { $set: {role: req.body.role } });
        
        const newToken = jwt.sign({ id: payload.id, role: req.body.role }, process.env.SECRET_TOKEN, {
            expiresIn: '30s'
        });
        const newRefreshToken= jwt.sign({ id: payload.id, role: req.body.role }, process.env.REFRESH_TOKEN, {
            expiresIn: '7d'
        });
        
        await RefreshToken.findOneAndUpdate({ token: newRefreshToken }, { userId: payload.id }, { upsert: true });

        res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/auth/'
            });
        res.status(200).json({ token: newToken});

    } catch (err) {
        console.error('Token refresh error:', err);
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }
        return res.status(500).json({ message: 'Server error during token refresh' });
    }
}

export { register, login, logout, token, updateRole }