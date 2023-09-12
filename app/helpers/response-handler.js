const sendResponseWithResults = (res, statusCode, data) => {
    res.status(statusCode).json({
        status: 'success',
        results: data.length,
        data: data
    });
};

const sendResponse = (res, statusCode, data) => {
    res.status(statusCode).json({
        status: 'success',
        data: data
    });
};

const sendSuccessResponse = (res, statusCode) => {
    res.status(statusCode).json({
        status: 'success'
    });
};

module.exports = {
    sendResponseWithResults,
    sendResponse,
    sendSuccessResponse
};
