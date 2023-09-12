const template = require('../routes/template.routes');
const user = require('../routes/user.routes');
const addRequestTime = require('../middlewares/request-time.spec');
const { globalErrorHandler, apiError } = require('../middlewares/error.middleware');

module.exports = (app) => {

    if (process.env.NODE_ENV === 'development') {
        app.use('*', addRequestTime);
    }

    app
        .use('/web', template)
        .use('/api/user', user)
        .all('*', apiError)
        .use(globalErrorHandler);
};