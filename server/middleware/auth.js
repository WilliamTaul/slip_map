const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Unauthorized Access" });

    jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
        if (err) return res.status(401).json({ message: "Forbidden access", error: err });
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;