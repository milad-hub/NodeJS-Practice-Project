const statusCode = require('../config/status-codes');

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

const handleInternalServerError = (next) => {
    return next(new AppError('Internal server error', statusCode.internalServerError));
};

const handleBadRequestError = (next) => {
    return next(new AppError('Bad request', statusCode.badRequest));
};

const handlePaginationError = (next) => {
    return next(new AppError('Page not found', statusCode.notFound));
};

const handleUserNotExistsError = (user, next) => {
    if (!user) {
        return next(new AppError('User not found', statusCode.notFound));
    }
};

const handleAsyncErrors = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};


module.exports = {
    AppError,
    handleAsyncErrors,
    handleBadRequestError,
    handlePaginationError,
    handleUserNotExistsError,
    handleInternalServerError
};