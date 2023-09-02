const template = require('../routes/template.routes');
const user = require('../routes/user.routes');
const addRequestTime = require('../middlewares/request-time.spec');

module.exports = (app) => {

    if (process.env.NODE_ENV === 'development') {
        app.use('*', addRequestTime);
    }

    app
        .use('/api/user', user)
        .use('/', template);
};