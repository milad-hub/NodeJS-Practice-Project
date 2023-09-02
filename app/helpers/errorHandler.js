const handleBadRequestError = (res) => {
    res.status(400).json({
        status: "fail",
        message: "Bad request"
    });
};

const handlePaginationError = (res) => {
    res.status(400).json({
        status: "fail",
        message: "Page not found"
    });
};

const handleInternalServerError = (res, err = null) => {
    const message = err?.message ?? "Internal server error";
    res.status(500).json({
        status: "fail",
        message: message
    });
};

module.exports = {
    handleBadRequestError,
    handlePaginationError,
    handleInternalServerError
};