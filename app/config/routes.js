const express = require('express');
const path = require('path');
const { globalErrorHandler, routeNotFoundHandler } = require('../middlewares/error.middleware');
const { handleDbErrors } = require('../helpers/handlers/error');
const { isDevEnvironment } = require('../helpers/common');
const addRequestTime = require('../middlewares/request-time.spec');
const webTemplate = require('../routes/template.routes');
const auth = require('../routes/auth.routes');
const user = require('../routes/user.routes');

module.exports = (app) => {

    if (isDevEnvironment) {
        app.use('*', addRequestTime);
    }

    app
        .get('/', (req, res) => {
            res.redirect('/web');
        })
        .use(express.static(path.join(__dirname, '../')));

    app
        .use('/web', webTemplate)
        .use('/api/auth', auth)
        .use('/api/user', user);

    app
        .all('*', routeNotFoundHandler)
        .use(handleDbErrors)
        .use(globalErrorHandler);
};