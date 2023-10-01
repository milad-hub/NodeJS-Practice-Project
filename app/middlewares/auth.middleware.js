const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../helpers/common');

const signToken = (req, res, next) => {
    const token = jwt.sign({ id: , secret: jwtSecretKey });

    next();
};