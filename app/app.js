const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser());

require('./config/db')();
require('./config/routes')(app);


module.exports = app;