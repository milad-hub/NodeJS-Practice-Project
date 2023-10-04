const { statusCode } = require('../config/config');
const { handleAsyncErrors, AppError } = require('../helpers/handlers/error');
const { decodeToken } = require('../services/auth');

const authGuard = handleAsyncErrors(async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        res.redirect('/auth');
        return next(new AppError('Invalid token', statusCode.unauthorized));
    }

    try {
        decodeToken(token);
        next();
    } catch (error) {
        res.redirect('/auth');
        return next(new AppError('Invalid token', statusCode.unauthorized));
    }

    next();
});

module.exports = authGuard;
