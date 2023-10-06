const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const { User } = require('../models/user');
const { AppError } = require('../helpers/handlers/error');
const { statusCode } = require('../config/config');
const { jwtSecretKey, cyptoSecretKey } = require('../config/auth');

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

    const signedToken = signToken(user._id);

    const encrptedToken = encryptToken(signedToken);

    return encrptedToken;
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

module.exports = {
    authenticateUser,
    decodeToken,
    encryptToken,
    decryptToken
};