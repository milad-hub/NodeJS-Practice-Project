const addRequestTime = (req, res, next) => {
    req.requestTime = new Date().toISOString();

    console.log('=====================================================================');
    console.log(`Request URL => ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log('Request Time => ', req.requestTime);
    console.log('=====================================================================');

    next();
};

module.exports = addRequestTime;
