const statusCode = require('../config/status-codes');

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const handleBadRequestError = (res) => {
    res.status(statusCode.badRequest).json({
        data: "",
        results: "",
        message: "",
        messages: []
    });
};

const handlePaginationError = (res) => {
    res.status(statusCode.badRequest).json({
        data: "",
        results: "",
        message: "Page not found",
        messages: []
    });
};

const handleInternalServerError = (res, err = null) => {
    const message = err?.message ?? "Internal server error";
    res.status(statusCode.internalServerError).json({
        data: "",
        results: "",
        message: message,
        messages: []
    });
};

module.exports = {
    AppError,
    handleBadRequestError,
    handlePaginationError,
    handleInternalServerError
};