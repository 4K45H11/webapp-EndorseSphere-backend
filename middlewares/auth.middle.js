const jwt = require('jsonwebtoken')

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" })
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY)

        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}

exports.authorizeUser = (...users) => {
    return (req, res, next) => {
        if (!users.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access not allowed' })
        }
        next();
    }
}