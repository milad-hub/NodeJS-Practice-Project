const express = require('express');
const path = require('path');
const webTemplate = require('../routes/template.routes');
const user = require('../routes/user.routes');
const addRequestTime = require('../middlewares/request-time.spec');
const { globalErrorHandler, routeNotFoundHandler } = require('../middlewares/error.middleware');
const { handleDbErrors } = require('../helpers/handlers/error');
const isDevEnvironment = require('../helpers/enviroment');

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
        .use('/api/user', user);

    app
        .all('*', routeNotFoundHandler)
        .use(handleDbErrors)
        .use(globalErrorHandler);
};