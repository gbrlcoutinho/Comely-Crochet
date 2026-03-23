const jwt = require('jsonwebtoken');

const authToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];

    if (!tokenHeader) {
        return res.status.json({Error: "Access denied. Token was not provided."});

        const token = tokenHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.loggedUser = decoded;

            next();
        }

        catch (error) {
            return res.status(403).json({Error: "Invalid or expired token."});
        }
    }
};

const authAdmin = (req, res, next) => {
    if (!req.loggedUser || req.loggedUser.isAdmin !== true) {
        return res.status(403).json({Error: "Access restricted to administrator only."});
    }

    next();
}

module.exports = { authToken, authAdmin };