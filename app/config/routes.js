const express = require('express');
const path = require('path');
const { globalErrorHandler, routeNotFoundHandler } = require('../middlewares/error.middleware');
const { handleDbErrors } = require('../helpers/handlers/error');
const { isDevEnvironment } = require('../helpers/common');
const addRequestTime = require('../middlewares/request-time.spec');
const authGuard = require('../middlewares/auth.middleware');
const webTemplate = require('../routes/template.routes');
const auth = require('../routes/auth.routes');
const user = require('../routes/user.routes');
const { role } = require('../models/user');

module.exports = (app) => {

    // if (isDevEnvironment) {
    //     app.use('*', addRequestTime);
    // }

    app
        .get('/', (req, res) => {
            res.redirect('/web');
        })
        .use(express.static(path.join(__dirname, '../')));

    app
        .use('/auth', auth);

    app
        .use('/web', authGuard([role.admin, role.user]), webTemplate)
        .use('/api/user', authGuard([role.admin]), user);

    app
        .all('*', routeNotFoundHandler)
        .use(handleDbErrors)
        .use(globalErrorHandler);
};