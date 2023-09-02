const User = require('../models/user');
const { checkAndFilterQuery, isEmptyObject } = require('../services/common');
const { handleInternalServerError, handlePaginationError } = require('../helpers/errorHandler');

const filterUser = (req, res) => {
    if (isEmptyObject(req.query)) {
        return listUsers(req.query, res);
    }

    if (checkFieldsQuery(req)) {
        return fieldsQuery(req, res);
    }

    if (checkSortQuery(req)) {
        return sortQuery(req, res);
    }

    if (checkPaginationQuery(req)) {
        return paginationQuery(req, res);
    }

    filterQuery(req, res);
};

const listUsers = async (query, res) => {
    try {
        const filterResult = await User.find(query).select('-__v');
        return res.status(200).json({
            status: 'success',
            results: filterResult.length,
            data: filterResult,
        });
    } catch (error) {
        return handleInternalServerError(res);
    }
};

const filterQuery = (req, res) => {
    const filteredQuery = checkAndFilterQuery(User.schema, req.query);

    if (isEmptyObject(filteredQuery)) {
        return res.status(200).json({
            status: 'success',
            results: 0,
            data: [],
        });
    }

    listUsers(filteredQuery, res);
};

const sortQuery = async (req, res) => {
    try {
        const sortBy = req.query.sort.split(',').join(' ');
        const sortedResult = await User.find().sort(sortBy).select('-__v');

        return res.status(200).json({
            status: 'success',
            results: sortedResult.length,
            data: sortedResult,
        });
    } catch (error) {
        return handleInternalServerError(res);
    }
};

const fieldsQuery = async (req, res) => {
    try {
        const fields = req.query.fields.split(',').join(' ');
        const result = await User.find().select(fields).select('-__v');

        return res.status(200).json({
            status: 'success',
            results: result.length,
            data: result,
        });
    } catch (error) {
        return handleInternalServerError(res);
    }
};

const paginationQuery = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 20;
        const skip = (page - 1) * limit;
        const result = await User.find().skip(skip).limit(limit).select('-__v');
        if (result.length === 0) {
            return handlePaginationError(res);
        }

        return res.status(200).json({
            status: 'success',
            results: result.length,
            data: result,
        });
    } catch (error) {
        return handleInternalServerError(res);
    }
};

const checkSortQuery = (req) => {
    return req.query.sort && typeof req.query.sort === 'string';
};

const checkFieldsQuery = (req) => {
    return req.query.fields && typeof req.query.fields === 'string';
};

const checkPaginationQuery = (req) => {
    return +req.query.page && +req.query.limit;
};

module.exports = {
    filterUser,
};
