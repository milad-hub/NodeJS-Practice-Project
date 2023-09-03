const getOldestUsers = (req, res, next) => {
    req.query = {
        sort: "-age",
        fields: "-_id, firstName, lastName, age",
        page: "1",
        limit: "10"
    };

    next();
};

const getActiveUsers = (req, res, next) => {
    req.query = {
        fields: "-_id, firstName, lastName, age, email, hobbies",
        isActive: "true",
        page: "1",
        limit: "10"
    };

    next();
};

module.exports = {
    getOldestUsers,
    getActiveUsers
};
