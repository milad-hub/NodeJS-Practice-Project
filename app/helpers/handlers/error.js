const { statusCode } = require('../../config/config');
const isDevEnviroment = require('../common');

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

const handleDbErrors = (err, req, res, next) => {

    handleDbCastErrors(err);

    handleDbValidationErrors(err);

    handleDbDuplicateFieldError(err);

    isDevEnviroment ? next(err) : next(new AppError('Something went wrong', statusCode.internalServerError));
};

const handleDbCastErrors = (err) => {
    if (err.name === 'CastError') {
        throw new AppError(`Invalid ${err.path}:  ${err.value}`, statusCode.badRequest);
    }
};

const handleDbValidationErrors = (err) => {
    if (err.name === 'ValidationError') {
        const fields = Object.values(err.errors).map(el => el.message);

        throw new AppError(`Invalid input data: ${fields.join(', ')}`, statusCode.badRequest);
    }
};

const handleDbDuplicateFieldError = (err) => {
    if (err.code === 11000) {
        const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0].replace(/["']/g, '');

        throw new AppError(`Duplicate field value entered: ${value}`, statusCode.badRequest);
    }
};

////////////////////////////////////////////////////////////////////////////////////////

const handleInternalServerError = () => {
    throw new AppError('Internal server error', statusCode.internalServerError);
};

const handleBadRequestError = () => {
    throw new AppError('Bad request', statusCode.badRequest);
};

const handlePaginationError = () => {
    throw new AppError('Page not found', statusCode.notFound);
};

const handleUserNotExistsError = (user) => {
    if (!user) {
        throw new AppError('User not found', statusCode.notFound);
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