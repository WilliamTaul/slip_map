const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Middleware Unauthorized Access" });
    }


    jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
        if (err) {
            console.warn('JWT verification failed: ', err.message);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token Expired" });
            }
            return res.status(403).json({ message: "Invalid Token" });
        }
        if (!user) {
            return res.status(401).json({ message: "Invalid Token" });
        }
        req.user = user;
        next();
    });
}

function authenticateAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Unauthorized Access" });

    jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
        if (err) {
            console.warn('JWT verification failed: ', err.message);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token Expired" });
            }
            return res.status(403).json({ message: "Invalid Token" });
        }
        if (!user) {
            return res.status(401).json({ message: "Invalid Token" });
        }
        if (user.role !== 'admin') return res.status(403).json({ message: "Access denied" })
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken, authenticateAdmin };