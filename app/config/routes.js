const webTemplate = require('../routes/template.routes');
const user = require('../routes/user.routes');
const addRequestTime = require('../middlewares/request-time.spec');
const { globalErrorHandler, routeNotFound } = require('../middlewares/error.middleware');

module.exports = (app) => {

    if (process.env.NODE_ENV === 'development') {
        app.use('*', addRequestTime);
    }

    app
        .use('/web', webTemplate)
        .use('/api/user', user)
        .all('*', routeNotFound)
        .use(globalErrorHandler);
};