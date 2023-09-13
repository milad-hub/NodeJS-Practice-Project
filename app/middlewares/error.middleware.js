const { AppError } = require('../helpers/error-handler');
const statusCode = require('../config/status-codes');

const routeNotFound = (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`, statusCode.notFound));
};

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = res.statusCode || statusCode.internalServerError;

    res.status(err.statusCode).json({
        data: "",
        results: "",
        message: err.message,
        messages: [err.messages],
    });
};

module.exports = {
    routeNotFound,
    globalErrorHandler
};