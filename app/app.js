const express = require('express');
const cookieParser = require('cookie-parser');
const sanitizeUserInput = require('./middlewares/xss.middleware');
const { limiter } = require('./config/config');
const mongoSanitize = require('express-mongo-sanitize');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(limiter);
app.use(sanitizeUserInput);
app.use(mongoSanitize());
app.disable('x-powered-by');


require('./config/db')();
require('./config/routes')(app);


module.exports = app;
