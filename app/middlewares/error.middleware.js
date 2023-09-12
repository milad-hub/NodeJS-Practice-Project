const { AppError } = require('../helpers/error-handler');
const statusCode = require('../config/status-codes');

const apiError = (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`, statusCode.notFound));
};

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = res.statusCode || statusCode.internalServerError;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};

module.exports = {
    apiError,
    globalErrorHandler
};