const express = require('express');
const app = express();

app.use(express.json());

require('./config/db')();
require('./config/routes')(app);


module.exports = app;