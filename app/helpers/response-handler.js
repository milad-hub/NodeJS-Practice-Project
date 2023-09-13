const sendResponse = (res, statusCode, data) => {
    res.status(statusCode).json({
        data: data,
        results: data.lenght,
        message: "",
        messages: []
    });
};

const sendSuccessResponse = (res, statusCode) => {
    res.status(statusCode).json({
        data: "",
        results: 0,
        message: "",
        messages: []
    });
};

module.exports = {
    sendResponse,
    sendSuccessResponse
};
