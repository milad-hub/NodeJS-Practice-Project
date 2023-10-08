const { User } = require('../../models/user');
const { sendResponse } = require('../../helpers/handlers/response');
const { handleAsyncErrors } = require('../../helpers/handlers/error');
const { statusCode } = require('../../config/config');
const { authenticateUser, getUserIdByUsername, decryptToken, encryptToken } = require('../../services/auth');
const { storeToken, revokeToken } = require('../../services/token');

class AuthController {

    constructor() {
        this.loginUser = handleAsyncErrors(this.loginUser.bind(this));
        this.registerUser = handleAsyncErrors(this.registerUser.bind(this));
        this.logoutUser = handleAsyncErrors(this.logoutUser.bind(this));
    }

    async loginUser(req, res, next) {
        const { username, password } = req.body;

        const token = await authenticateUser(username, password);

        if (token) {
            const userId = await getUserIdByUsername(username);
            await storeToken(userId, token);
            const encryptedToken = encryptToken(token);

            res.cookie('token', encryptedToken, { httpOnly: true });
            res.redirect('/web/users');
        }
    }

    async registerUser(req, res, next) {
        const userData = req.body;

        if (userData) {
            const user = new User(userData);
            await user.save();
        }

        sendResponse(res, statusCode.created, '', 'Registered successfully');
    }

    async logoutUser(req, res, next) {
        const token = req.cookies.token;

        if (token) {
            const decryptedToken = decryptToken(token);
            await revokeToken(decryptedToken);
        }

        res.clearCookie('token', { httpOnly: true });
        res.redirect('/auth');
    }


}

module.exports = {
    AuthController,
};
