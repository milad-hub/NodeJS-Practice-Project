const { User, UserStatsAggregateOptions } = require('../models/user');
const { filterUser } = require('../services/user');
const { checkUserExists, checkSchemaMatch } = require('../services/common');
const { handleInternalServerError } = require('../helpers/errorHandler');

const userController = {

    listUsers: async (req, res) => {
        try {
            filterUser(req, res);
        }
        catch (error) {
            handleInternalServerError(res, error);
        }
    },

    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            checkUserExists(user);

            res.status(200).json({
                status: "success",
                data: user
            });
        }
        catch (error) {
            handleInternalServerError(res, error);
        }
    },

    createUser: async (req, res) => {
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
    },

    updateUser: async (req, res) => {
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
        }
        catch (error) {
            handleInternalServerError(res, error);
        }
    },

    deleteUser: async (req, res) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            checkUserExists(deletedUser);

            res.status(200).json({
                status: "success",
                data: deletedUser
            });
        }
        catch (error) {
            handleInternalServerError(res, error);
        }
    }
};

const userAggregationController = {

    getUserStats: async (req, res) => {
        try {
            const stats = await User.aggregate(UserStatsAggregateOptions);
            res.json({
                status: "success",
                data: stats
            });
        } catch (error) {
            handleInternalServerError(res, error);
        }
    },
};


module.exports = {
    userController,
    userAggregationController
};
