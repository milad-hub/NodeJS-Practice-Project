const xss = require('xss');
const { AppError } = require('../helpers/handlers/error');
const { statusCode } = require('../config/config');

const sanitizeUserInput = (req, res, next) => {
    if (req.body) {
        for (const key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                const value = req.body[key];
                const sanitizedValue = xss(value);
                if (sanitizedValue !== value) {
                    throw new AppError(`You can not use HTML tags in the fields`, statusCode.badRequest);
                }
                req.body[key] = sanitizedValue;
            }
        }
    }

    next();
};

module.exports = sanitizeUserInput;
