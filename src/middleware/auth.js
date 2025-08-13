const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token){
        return res.status(401).json({
            message: 'Access token required'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err){
            return res.status(403).json({
                message:'Invalid or expired token'
            });
        }
        req.user = user;
        next();
        });
};

const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user.allRoles || !req.user.allRoles.some(role => allowedRoles.includes(role))){
            return res.status(403).json({
                message: `Access denied. One of these roles required: ${allowedRoles.join(', ')}`
            });
            }
            next();
        };
    
};

module.exports = { authenticateToken, requireRole };