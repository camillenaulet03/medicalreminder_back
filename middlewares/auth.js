const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        let token = req.header('authorization');
        token = token.replace('Bearer ', '');

        if (!token) return res.status(401).send('Access denied');

        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) return res.status(403).send('Invalid token');
            req.user = user;
            next();
        });
    } catch {
        res.status(403).json({ message: 'Unauthorized' });
    }
};
