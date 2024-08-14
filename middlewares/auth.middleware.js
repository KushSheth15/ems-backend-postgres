const jwt = require("jsonwebtoken");
const db = require("../models/index");
const config = require("../config/auth.config");
const User = db.User;

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }

    try {
        const decoded = jwt.verify(token,config.ACCESS_TOKEN_SECRET);
        const user = await User.findOne({ where: { id: decoded.id } });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized - User not found' });
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
}

module.exports = verifyToken;