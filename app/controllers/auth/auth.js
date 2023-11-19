const { User } = require('../../models/user');
const { sendResponse } = require('../../helpers/handlers/response');
const { handleAsyncErrors, AppError } = require('../../helpers/handlers/error');
const { statusCode, emailRegex } = require('../../config/config');
const { storeToken, revokeToken } = require('../../services/token');
const { authenticateUser, getUserIdByUsername, sendPasswordResetEmail, modifyPassword, getUserByEmail } = require('../../services/auth');
const { storeUserInfoInRedisCache } = require('../../services/redis');

class AuthController {

    constructor() {
        this.loginUser = handleAsyncErrors(this.loginUser.bind(this));
        this.registerUser = handleAsyncErrors(this.registerUser.bind(this));
        this.logoutUser = handleAsyncErrors(this.logoutUser.bind(this));
        this.resetPassword = handleAsyncErrors(this.resetPassword.bind(this));
    }

    async loginUser(req, res, next) {
        const { username, password } = req.body;

        const token = await authenticateUser(username, password);

        if (token) {
            const userId = await getUserIdByUsername(username);
            await storeToken(userId, token);
            await storeUserInfoInRedisCache(userId);

            //TODO { secure: true } flag only when connection is on https
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/web/users');
        } else {
            throw new AppError('Something went wrong', statusCode.internalServerError);
        }
    }

    async registerUser(req, res, next) {
        const userData = req.body;

        if (userData) {

            if (userData.role) delete userData.role;

            const user = new User(userData);
            await user.save();
        }

        sendResponse(res, statusCode.created, '', 'Registered successfully');
    }

    async logoutUser(req, res, next) {
        const token = req.cookies.token;

        if (token) {
            await revokeToken(token);
        }

        res.clearCookie('token', { httpOnly: true });
        res.redirect('/auth');
    }

    async forgotPassword(req, res, next) {
        const { email } = req.body;

        if (!emailRegex.test(email) || email.includes('+')) {
            throw new AppError('Invalid email format!', statusCode.badRequest);
        }

        const user = await getUserByEmail(email);

        if (!user) {
            return next(new AppError('The email is not registered!', statusCode.badRequest));
        }

        sendPasswordResetEmail(user);
        sendResponse(res, statusCode.ok, '', 'The reset password email sent successfully');
    }

    async resetPassword(req, res, next) {
        const { token, password, passwordConfirm } = req.body;

        if (token && password && passwordConfirm) {
            await modifyPassword(token, password, passwordConfirm);
            sendResponse(res, statusCode.ok, '', 'The password changed successfully');
        }
    }
}

module.exports = {
    AuthController,
};
