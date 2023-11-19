const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { AppError } = require('../helpers/handlers/error');
const sendMail = require('../helpers/sendMail');
const { statusCode } = require('../config/config');
const { jwtSecretKey, baseUrl } = require('../config/auth');
const { resetPasswordEmailOptions } = require('../config/email');

const authenticateUser = async (username, password) => {

    if (!username || !password) {
        throw new AppError('Username and password are required.', statusCode.badRequest);
    }

    const user = await User.findOne({ username }).select('_id role +password isActive');

    if (!user) {
        throw new AppError('Invalid username and password', statusCode.unauthorized);
    }

    const isPasswordValid = await user.comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new AppError('Invalid username and password', statusCode.unauthorized);
    }

    if (!user.isActive) {
        throw new AppError('User is not activated', statusCode.unauthorized);
    }

    const signedToken = signToken(user._id);

    return signedToken;
};

const sendPasswordResetEmail = async (user) => {

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${baseUrl}/auth/${resetToken}`;

    const resetEmail = resetPasswordEmailOptions(user.firstName, resetUrl);

    try {
        await sendMail(user.email, resetEmail.subject, resetEmail.body);
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false });

        throw new AppError('Reset password email sending failed!', statusCode.internalServerError);
    }
};

const modifyPassword = async (token, password, passwordConfirm) => {
    const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new AppError('Invalid token or token expired', statusCode.badRequest);
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
};


const signToken = (userId) => {
    const token = jwt.sign({ id: userId }, jwtSecretKey, {
        expiresIn: 3600
    });
    return token;
};

const decodeToken = (token) => {
    const decoded = jwt.verify(token, jwtSecretKey);
    return decoded;
};

const getUserByEmail = async (email) => {
    const user = await User.findOne({ email });

    return user;
};

const getUserIdByUsername = async (username) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new AppError('User not found', statusCode.notFound);
    }
    return user._id;
};

const isUserValid = async (userId) => {
    return await User.exists({ _id: userId });
};

const isUserActive = async (userId) => {
    const isValid = await isUserValid(userId);

    if (!isValid._id) {
        return;
    }

    const user = await User.findOne({ _id: userId }).select('+isActive');
    return user.isActive;
};



module.exports = {
    authenticateUser,
    sendPasswordResetEmail,
    getUserByEmail,
    modifyPassword,
    decodeToken,
    getUserIdByUsername,
    isUserValid,
    isUserActive
};