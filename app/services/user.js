const { User } = require('../models/user');
const { CommonServices } = require('../services/common');
const { handleInternalServerError, handlePaginationError } = require('../helpers/errorHandler');

class UserServices {

    constructor() {
        this._commonServices = new CommonServices();
    }

    async filterUser(req, res) {
        try {
            if (this._commonServices.isEmptyObject(req.query)) {
                return UserServices.getUsersList(req.query, res);
            }

            const filteredQuery = this._commonServices.checkAndFilterQuery(User.schema, req.query);

            const selectFields = UserServices.getSelectFields(req.query);
            const sortFields = UserServices.getSortFields(req.query);
            const skipValue = UserServices.getSkipValue(req.query);

            const totalRecords = await User.countDocuments(filteredQuery);

            if (skipValue >= totalRecords) {
                return handlePaginationError(res);
            }

            const result = await User.find(filteredQuery)
                .sort(sortFields)
                .select(selectFields)
                .skip(skipValue)
                .limit(req.query.limit);

            return UserServices.sendResponse(res, result);
        } catch (error) {
            return handleInternalServerError(res);
        }
    }

    static async getUsersList(query, res) {
        try {
            const filterResult = await User.find(query).select('-__v');
            return UserServices.sendResponse(res, filterResult);
        } catch (error) {
            return handleInternalServerError(res);
        }
    }

    static getSelectFields(query) {
        return query.fields ? query.fields.split(',').join(' ') : '-__v';
    }

    static getSortFields(query) {
        return query.sort ? query.sort.split(',').join(' ') : '_id';
    }

    static getSkipValue(query) {
        return (query.page - 1) * query.limit;
    }

    static sendResponse(res, data) {
        const responseData = {
            status: 'success',
            results: data.length,
            data: data
        };
        return res.status(200).json(responseData);
    }
}

module.exports = {
    UserServices
};