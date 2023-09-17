const statusCode = require('../config/status-codes');
const isDevEnviroment = require('../helpers/enviroment');

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

const handleDbErrors = (err, req, res, next) => {

    handleDbCastErrors(err, next);

    handleDbValidationErrors(err, next);

    handleDbDuplicateFieldError(err, next);

    isDevEnviroment ? next(err) : next(new AppError('Something went wrong', statusCode.internalServerError));
};

const handleDbCastErrors = (err, next) => {
    if (err.name === 'CastError') {
        return next(new AppError(`Invalid ${err.path}:  ${err.value}`, statusCode.badRequest));
    }
};

const handleDbValidationErrors = (err, next) => {
    if (err.name === 'ValidationError') {
        const fields = Object.values(err.errors).map(el => el.message);

        return next(new AppError(`Invalid input data: ${fields.join(', ')}`, statusCode.badRequest));
    }
};

const handleDbDuplicateFieldError = (err, next) => {
    if (err.code === 11000) {
        const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0].replace(/["']/g, '');

        return next(new AppError(`Duplicate field value entered: ${value}`, statusCode.badRequest));
    }
};

////////////////////////////////////////////////////////////////////////////////////////

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
    handleDbErrors,
    handleAsyncErrors,
    handleBadRequestError,
    handlePaginationError,
    handleUserNotExistsError,
    handleInternalServerError
};