const rateLimit = require('express-rate-limit');

const statusCode = {
    ok: 200,
    created: 201,
    accepted: 202,
    noContent: 204,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    methodNotAllowed: 405,
    requestTimeout: 408,
    conflict: 409,
    internalServerError: 500,
    badGateway: 502,
    serviceUnavailable: 503,
    gatewayTimeout: 504
};

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 500,
    message: 'Too many requests from this IP, please try again after an hour',
    headers: 'draft-7'
});

const helmetOptions = {
    contentSecurityPolicy: {
        useDefaults: false,
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    frameguard: { action: 'deny' },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'same-origin' },
};

const hppOptions = {
    whitelist: [
        'duration',
        'sort',
        'age'
    ]
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = {
    statusCode,
    emailRegex,
    limiter,
    helmetOptions,
    hppOptions
};
