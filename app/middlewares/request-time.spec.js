const addRequestTime = (req, res, next) => {

    const startTime = Date.now();

    res.calculateQueryTime = () => {
        const endTime = Date.now();
        return endTime - startTime;
    };
    req.requestTime = new Date().toISOString();

    console.log('=====================================================================');
    console.log(`Request URL => ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log('Request At => ', req.requestTime);
    console.log(`Request Time => ${res.calculateQueryTime()} ms`);
    console.log('=====================================================================');

    next();
};

module.exports = addRequestTime;
