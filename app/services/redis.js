const { getUserInfoFromRedis, setUserInfoInRedis, setKeyExpireInRedis } = require('../helpers/redis');
const { User } = require('../models/user');

const storeUserInfoInRedisCache = async (userId) => {
    if (!userId) return;

    const isUserCached = await getUserInfoFromRedis(userId);

    if (isUserCached) {
        await setKeyExpireInRedis(userId);
        const userInfo = await User.findById(userId);
        return await setUserInfoInRedis(userInfo);
    }

    const userInfo = await User.findById(userId);
    await setUserInfoInRedis(userInfo);
};


const getUserRoleFromRedisCache = async (userId) => {
    const userInfo = await getUserInfoFromRedis(userId);

    if (userInfo) {
        return userInfo.role;
    }

    return;
};

module.exports = {
    storeUserInfoInRedisCache,
    getUserRoleFromRedisCache
};