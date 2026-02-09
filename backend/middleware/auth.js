const authMiddleware = (req, res, next) => {
    const adminSecret = req.headers['x-admin-secret'];

    if (!adminSecret) {
        return res.status(401).json({
            error: 'Access denied. No secret key provided.',
            code: 'NO_SECRET'
        });
    }

    if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({
            error: 'Access denied. Invalid secret key.',
            code: 'INVALID_SECRET'
        });
    }

    next();
};

export default authMiddleware;
