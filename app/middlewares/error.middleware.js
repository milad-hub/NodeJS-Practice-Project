const { AppError } = require('../helpers/handlers/error');
const { sendResponse } = require('../helpers/handlers/response');
const { statusCode } = require('../config/config');

const routeNotFoundHandler = (req, res, next) => {
    res.redirect('/auth/404');
};

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || statusCode.internalServerError;

    sendResponse(res, err.statusCode, "", err.message, err.messages);
};


module.exports = {
    routeNotFoundHandler,
    globalErrorHandler
};