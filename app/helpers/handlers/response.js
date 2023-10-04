const sendResponse = (res, statusCode, data = "", message = "", messages = "") => {
    res.status(statusCode).json({
        data: data,
        message: message,
        messages: messages
    });
};

module.exports = {
    sendResponse
};
