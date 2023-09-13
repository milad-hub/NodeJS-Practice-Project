const { User, UserStatsAggregateOptions, UserAgeAggregateOptions } = require('../models/user');
const { UserServices } = require('../services/user');
const { CommonServices } = require('../services/common');
const { sendResponse, sendSuccessResponse } = require('../helpers/response-handler');
const statusCode = require('../config/status-codes');

class UserController {

    constructor() {
        this._userServices = new UserServices();
        this._commonServices = new CommonServices();

        this.getUsersList = this._commonServices.handleAsyncErrors(this.getUsersList.bind(this));
        this.getUser = this._commonServices.handleAsyncErrors(this.getUser.bind(this));
        this.createUser = this._commonServices.handleAsyncErrors(this.createUser.bind(this));
        this.updateUser = this._commonServices.handleAsyncErrors(this.updateUser.bind(this));
        this.deleteUser = this._commonServices.handleAsyncErrors(this.deleteUser.bind(this));
    }

    async getUsersList(req, res) {
        await this._userServices.filterUser(req, res);
    };

    async getUser(req, res) {
        const { id } = req.params;
        const user = await User.findById(id);

        this._commonServices.handleUserNotExists(user);

        sendResponse(res, statusCode.ok, user);
    }

    async createUser(req, res) {
        const data = Array.isArray(req.body) ? req.body : [req.body];

        const validData = data.filter((obj) => this._commonServices.checkSchemaMatch(User.schema, obj, res));

        if (validData.length > 0) {
            await User.insertMany(validData);
        }

        sendSuccessResponse(res, statusCode.created);
    }


    async updateUser(req, res) {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        this._commonServices.handleUserNotExists(updatedUser);

        sendResponse(res, statusCode.ok, updatedUser);
    };

    async deleteUser(req, res) {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        this._commonServices.handleUserNotExists(deletedUser);

        sendResponse(res, statusCode.ok, deletedUser);
    };
}

class UserAggregationController {

    constructor() {
        this._commonServices = new CommonServices();

        this.getUserStats = this._commonServices.handleAsyncErrors(this.getUserStats.bind(this));
        this.getFilterUserByAge = this._commonServices.handleAsyncErrors(this.getFilterUserByAge.bind(this));
    }

    async getUserStats(req, res) {
        const result = await User.aggregate(UserStatsAggregateOptions);

        sendResponse(res, statusCode.ok, result);
    };

    async getFilterUserByAge(req, res) {
        const age = +req.params.age;
        const result = await User.aggregate(UserAgeAggregateOptions(age));

        sendResponse(res, statusCode.ok, result);
    };
}

module.exports = {
    UserController,
    UserAggregationController,
};
