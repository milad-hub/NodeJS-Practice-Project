const redis = require('redis');

const redisClient = redis.createClient();
redisClient.connect();

const getUserInfoFromRedis = async (userId) => {
    try {
        const value = await redisClient.get(`${userId}`);

        if (!value) {
            return;
        }

        return JSON.parse(value);
    } catch (error) { }
};

const setUserInfoInRedis = async (user) => {
    try {
        await redisClient.set(`${user._id}`, JSON.stringify(user), 'EX', 3600);
    } catch (error) { }
};

const refreshUserInfoInRedis = async (userId) => {
    try {
        await redisClient.expire(`${userId}`, 3600);
    } catch (error) { }
};

const setKeyExpireInRedis = async (userId) => {
    try {
        await redisClient.expire(`${userId}`, 0);
    } catch (error) { }
};

module.exports = {
    getUserInfoFromRedis,
    setUserInfoInRedis,
    refreshUserInfoInRedis,
    setKeyExpireInRedis
};