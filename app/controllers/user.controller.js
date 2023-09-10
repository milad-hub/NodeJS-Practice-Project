const { User, UserStatsAggregateOptions, UserAgeAggregateOptions } = require('../models/user');
const { filterUser } = require('../services/user');
const { checkUserExists, checkSchemaMatch } = require('../services/common');
const { handleInternalServerError } = require('../helpers/errorHandler');

class UserController {
    async listUsers(req, res) {
        try {
            await filterUser(req, res);
        } catch (error) {
            handleInternalServerError(res, error);
        }
    }

    async getUser(req, res) {
        try {
            const user = await User.findById(req.params.id);
            checkUserExists(user);

            res.status(200).json({
                status: "success",
                data: user
            });
        } catch (error) {
            handleInternalServerError(res, error);
        }
    }

    async createUser(req, res) {
        try {
            const data = Array.isArray(req.body) ? req.body : [req.body];
            for (const obj of data) {
                if (checkSchemaMatch(User.schema, obj, res)) {
                    await User.create(obj);
                }
            }
            res.status(201).json({
                status: "success"
            });
        } catch (error) {
            handleInternalServerError(res, error);
        }
    }

    async updateUser(req, res) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });
            checkUserExists(updatedUser);

            res.status(200).json({
                status: "success",
                data: updatedUser
            });
        } catch (error) {
            handleInternalServerError(res, error);
        }
    }

    async deleteUser(req, res) {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            checkUserExists(deletedUser);

            res.status(200).json({
                status: "success",
                data: deletedUser
            });
        } catch (error) {
            handleInternalServerError(res, error);
        }
    }
}

class UserAggregationController {
    async getUserStats(req, res) {
        try {
            const result = await User.aggregate(UserStatsAggregateOptions);
            res.status(200).json({
                status: "success",
                data: result
            });
        } catch (error) {
            handleInternalServerError(res, error);
        }
    }

    async getUserDobFilter(req, res) {
        try {
            const age = +req.params.age;
            const result = await User.aggregate(UserAgeAggregateOptions(age));
            res.status(200).json({
                status: "success",
                results: result.length,
                data: result
            });
        } catch (error) {
            handleInternalServerError(res, error);
        }
    }
}

const userController = new UserController();
const userAggregationController = new UserAggregationController();

module.exports = { userController, userAggregationController };
