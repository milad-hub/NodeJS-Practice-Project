const express = require('express');
const path = require('path');
const helmet = require('helmet');
const { globalErrorHandler, routeNotFoundHandler } = require('../middlewares/error.middleware');
const { handleDbErrors } = require('../helpers/handlers/error');
const { isDevEnvironment } = require('../helpers/common');
const addRequestTime = require('../middlewares/request-time.spec');
const authGuard = require('../middlewares/auth.middleware');
const webTemplate = require('../routes/template.routes');
const auth = require('../routes/auth.routes');
const user = require('../routes/user.routes');
const blog = require('../routes/blog.routes');
const { role } = require('../models/user');
const { helmetOptions } = require('./config');

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
        .use('/blog', blog);

    app
        .use('/web', authGuard([role.admin, role.user]), webTemplate)
        .use('/api/user', authGuard([role.admin]), helmet(helmetOptions), user);

    app
        .all('*', routeNotFoundHandler)
        .use(handleDbErrors)
        .use(globalErrorHandler);
};