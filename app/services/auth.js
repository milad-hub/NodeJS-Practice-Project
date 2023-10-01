const { User } = require('../models/user');
const { AppError } = require('../helpers/handlers/error');
const { statusCode } = require('../config/config');

const authenticateUser = async (username, password) => {

    if (!username || !password) {
        throw new AppError('Username and password are required.', statusCode.badRequest);
    }

    const user = await User.findOne({ username }).select('+password');

    if (!user) {
        throw new AppError('Invalid username and password', statusCode.unauthorized);
    }

    const isPasswordValid = await user.comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new AppError('Invalid username and password', statusCode.unauthorized);
    }

    return isPasswordValid;
};

module.exports = {
    authenticateUser
};