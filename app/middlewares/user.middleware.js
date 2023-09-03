const getOldestUsers = (req, res, next) => {
    req.query.sort = "-age";
    req.query.fields = "-_id,firstName,lastName,age";
    req.query.isActive = "true";
    req.query.page = "1";
    req.query.limit = "10";

    next();
};

module.exports = {
    getOldestUsers
};