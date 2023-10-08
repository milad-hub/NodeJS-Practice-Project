const Token = require('../models/token');

const storeToken = async (userId, token) => {
    return await Token.create({ userId, token });
};

const revokeToken = async (token) => {
    return await Token.deleteOne({ token });
};

const revokeTokensOnPasswordChange = async (userId) => {
    return await Token.deleteMany({ userId });
};

module.exports = {
    storeToken,
    revokeToken,
    revokeTokensOnPasswordChange
};
