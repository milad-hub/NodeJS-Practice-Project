const isDevEnvironment = () => {
    return process.env.NODE_ENV === 'development';
};

const jwtSecretKey = () => {
    return process.env.JWT_SECRET_KEY;
};

module.exports = {
    isDevEnvironment,
    jwtSecretKey
};