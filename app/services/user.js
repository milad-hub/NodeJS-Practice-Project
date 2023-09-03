const User = require('../models/user');
const { checkAndFilterQuery, isEmptyObject } = require('../services/common');
const { handleInternalServerError, handlePaginationError } = require('../helpers/errorHandler');

const filterUser = async (req, res) => {
    try {

        if (isEmptyObject(req.query)) {
            return listUsers(req.query, res);
        }

        const filteredQuery = checkAndFilterQuery(User.schema, req.query);

        const selectFields = getSelectFields(req.query);
        const sortFields = getSortFields(req.query);
        const skipValue = getSkipValue(req.query);

        const totalRecords = await User.countDocuments(filteredQuery);

        if (skipValue >= totalRecords) {
            return handlePaginationError(res);
        }

        const result = await User.find(filteredQuery)
            .sort(sortFields)
            .select(selectFields)
            .skip(skipValue)
            .limit(req.query.limit);

        return sendResponse(res, result);
    } catch (error) {
        return handleInternalServerError(res);
    }
};

const listUsers = async (query, res) => {
    try {
        const filterResult = await User.find(query).select('-__v');
        return sendResponse(res, filterResult);
    } catch (error) {
        return handleInternalServerError(res);
    }
};

const getSelectFields = (query) => {
    return query.fields ? query.fields.split(',').join(' ') : '-__v';
};

const getSortFields = (query) => {
    return query.sort ? query.sort.split(',').join(' ') : '_id';
};

const getSkipValue = (query) => {
    return (query.page - 1) * query.limit;
};

const sendResponse = (res, data) => {
    const responseData = {
        status: 'success',
        results: data.length,
        data: data
    };
    return res.status(200).json(responseData);
};

module.exports = {
    filterUser,
};