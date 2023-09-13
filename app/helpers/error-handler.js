const statusCode = require('../config/status-codes');

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

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

const handleInternalServerError = (next) => {
    return next(new AppError('Internal server error', statusCode.internalServerError));
};

module.exports = {
    AppError,
    handleBadRequestError,
    handlePaginationError,
    handleUserNotExistsError,
    handleInternalServerError
};