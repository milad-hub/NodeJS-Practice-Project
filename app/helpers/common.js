const isDevEnvironment = () => {
    return process.env.NODE_ENV === 'development';
};

module.exports = {
    isDevEnvironment,
};