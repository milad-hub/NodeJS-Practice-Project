const { User, UserStatsAggregateOptions, UserAgeAggregateOptions } = require('../models/user');
const { UserServices } = require('../services/user');
const { CommonServices } = require('../services/common');
const { handleInternalServerError } = require('../helpers/errorHandler');

class UserController {

    constructor() {
        this._userServices = new UserServices();
        this._commonServices = new CommonServices();
    }

    getUsersList = async (req, res) => {
        try {
            await this._userServices.filterUser(req, res);
        } catch (error) {
            handleInternalServerError(res, error);
        }
    };

    getUser = async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            this._commonServices.checkUserExists(user);

            res.status(200).json({
                status: 'success',
                data: user,
            });
        } catch (error) {
            handleInternalServerError(res, error);
        }
    };

    createUser = async (req, res) => {
        try {
            const data = Array.isArray(req.body) ? req.body : [req.body];
            for (const obj of data) {
                if (this._commonServices.checkSchemaMatch(User.schema, obj, res)) {
                    await User.create(obj);
                }
            }
            res.status(201).json({
                status: 'success',
            });
        } catch (error) {
            handleInternalServerError(res, error);
        }
    };

    updateUser = async (req, res) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );
            this._commonServices.checkUserExists(updatedUser);

            res.status(200).json({
                status: 'success',
                data: updatedUser,
            });
        } catch (error) {
            handleInternalServerError(res, error);
        }
    };

    deleteUser = async (req, res) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            this._commonServices.checkUserExists(deletedUser);

            res.status(200).json({
                status: 'success',
                data: deletedUser,
            });
        } catch (error) {
            handleInternalServerError(res, error);
        }
    };
}

class UserAggregationController {
    getUserStats = async (req, res) => {
        try {
            const result = await User.aggregate(UserStatsAggregateOptions);
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (error) {
            handleInternalServerError(res, error);
        }
    };

    getFilterUserByAge = async (req, res) => {
        try {
            const age = +req.params.age;
            const result = await User.aggregate(UserAgeAggregateOptions(age));
            res.status(200).json({
                status: 'success',
                results: result.length,
                data: result,
            });
        } catch (error) {
            handleInternalServerError(res, error);
        }
    };
}

module.exports = {
    UserController,
    UserAggregationController,
};
