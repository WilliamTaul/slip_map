import 'dotenv/config'

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import RefreshToken from '../models/refreshToken.js';
import User from '../models/user.js';

const register = async (req, res) => {
    if (req.body.password.length < 8) return res.status(409).json({ message: "Password must be at least 8 characters",
                                                                    errors: {password: "Password must be at least 8 characters!" } })
    if (req.body.password !== req.body.matchPassword) return res.status(409).json({ errors: { password: "Password must match!" } })

    try {
        const existingUser = await User.findOne({username: req.body.username});
        if (existingUser) return res.status(409).json({ errors: { username: "Username already taken!" }, message: 'Username already taken'});

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({username: req.body.username, password: hashedPassword});
        await user.save();
        
        const token = jwt.sign({id: user._id, role: user.role}, process.env.SECRET_TOKEN, {
            expiresIn: '30s'
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
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        if (await bcrypt.compare(req.body.password, user.password)) {
            await RefreshToken.deleteMany({ userId: user.id });
            const token = jwt.sign({id: user._id, role: user.role}, process.env.SECRET_TOKEN, {
                expiresIn: '30s'
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
            return res.status(401).json({ message: 'Invalid credentials'});
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

        await RefreshToken.deleteOne({ token: refreshToken });
        
        const newToken = jwt.sign({ id: payload.id, role: payload.role }, process.env.SECRET_TOKEN, {
            expiresIn: '30s'
        });
        const newRefreshToken= jwt.sign({ id: payload.id, role: payload.role }, process.env.REFRESH_TOKEN, {
            expiresIn: '7d'
        });
        
        await new RefreshToken({ token: newRefreshToken, userId: payload.id }).save();

        res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
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

export { register, login, logout, token }