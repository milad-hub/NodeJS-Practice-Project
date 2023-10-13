const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const { User } = require('../models/user');
const { AppError } = require('../helpers/handlers/error');
const sendMail = require('../helpers/sendMail');
const { statusCode } = require('../config/config');
const { jwtSecretKey, cryptoSecretKey, baseUrl } = require('../config/auth');
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

    const signedToken = signToken(user._id, user.role);

    return signedToken;
};

const sendPasswordResetEmail = async (email) => {

    const user = await getUserByEmail(email);
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


const signToken = (userId, userRole) => {
    const token = jwt.sign({ id: userId, role: userRole }, jwtSecretKey, {
        expiresIn: 3600
    });
    return token;
};

const decodeToken = (token) => {
    const decryptedToken = decryptToken(token);
    const decoded = jwt.verify(decryptedToken, jwtSecretKey);
    return decoded;
};

const encryptToken = (signedToken) => {
    const token = CryptoJS.AES.encrypt(JSON.stringify(signedToken), cryptoSecretKey).toString();
    return token;
};

const decryptToken = (encryptedToken) => {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, cryptoSecretKey);
    const token = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return token;
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
    modifyPassword,
    decodeToken,
    encryptToken,
    decryptToken,
    getUserIdByUsername,
    isUserValid,
    isUserActive
};