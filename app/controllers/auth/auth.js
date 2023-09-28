const { User } = require('../../models/user');
const { CommonServices } = require('../../services/common');
const { sendResponse } = require('../../helpers/handlers/response');
const { handleAsyncErrors } = require('../../helpers/handlers/error');
const { statusCode } = require('../../config/config');

class AuthController {

    constructor() {
        this._commonServices = new CommonServices();

        this.registerUser = handleAsyncErrors(this.registerUser.bind(this));
    }

    async registerUser(req, res, next) {
        const userData = req.body;

        const validUserData = this._commonServices.checkSchemaMatch(User.schema, userData, next);

        if (validUserData) {
            const user = new User(userData);
            await user.save();
        }

        sendResponse(res, statusCode.created);
    }
}

module.exports = {
    AuthController,
};
