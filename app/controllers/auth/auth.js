const { User } = require('../../models/user');
const { sendResponse } = require('../../helpers/handlers/response');
const { handleAsyncErrors } = require('../../helpers/handlers/error');
const { statusCode } = require('../../config/config');

class AuthController {

    constructor() {
        this.registerUser = handleAsyncErrors(this.registerUser.bind(this));
    }

    async registerUser(req, res, next) {
        const userData = req.body;

        if (userData) {
            const user = new User(userData);
            await user.save();
        }

        sendResponse(res, statusCode.created);
    }
}

module.exports = {
    AuthController,
};

