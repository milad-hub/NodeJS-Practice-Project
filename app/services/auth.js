const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const { User } = require('../models/user');
const { AppError } = require('../helpers/handlers/error');
const { statusCode } = require('../config/config');
const { jwtSecretKey, cyptoSecretKey } = require('../config/auth');

const authenticateUser = async (username, password, next) => {

    if (!username || !password) {
        return next(new AppError('Username and password are required.', statusCode.badRequest));
    }

    const user = await User.findOne({ username }).select('_id, +password, isActive');

    if (!user) {
        return next(new AppError('Invalid username and password', statusCode.unauthorized));
    }

    const isPasswordValid = await user.comparePassword(password, user.password);

    if (!isPasswordValid) {
        return next(new AppError('Invalid username and password', statusCode.unauthorized));
    }

    if (!user.isActive) {
        return next(new AppError('User is not activated', statusCode.unauthorized));
    }

    const signedToken = signToken(user._id);

    return signedToken;
};

const signToken = (userId) => {
    const token = jwt.sign({ id: userId }, jwtSecretKey, {
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
    const token = CryptoJS.AES.encrypt(JSON.stringify(signedToken), cyptoSecretKey).toString();
    return token;
};

const decryptToken = (encryptedToken) => {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, cyptoSecretKey);
    const token = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return token;
};

const getUserIdByUsername = async (username, next) => {
    const user = await User.findOne({ username });
    if (!user) {
        return next(new AppError('User not found', statusCode.notFound));
    }
    return user._id;
};

const isUserValid = (userId) => {
    return User.exists({ _id: userId });
};

const isUserActive = async (userId) => {
    const isValid = isUserValid(userId);
    if (!isValid) {
        return false;
    }
    const user = await User.findOne(userId).select('isActive');
    return user.isActive;
};



module.exports = {
    authenticateUser,
    decodeToken,
    encryptToken,
    decryptToken,
    getUserIdByUsername,
    isUserValid,
    isUserActive
};