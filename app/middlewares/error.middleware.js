const { AppError } = require('../helpers/error-handler');
const { sendResponse } = require('../helpers/response-handler');
const { statusCode } = require('../config/config');

const routeNotFoundHandler = (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`, statusCode.notFound));
};

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || statusCode.internalServerError;

    sendResponse(res, err.statusCode, "", err.message, err.messages);
};


module.exports = {
    routeNotFoundHandler,
    globalErrorHandler
};