const baseApiUrl = 'http://127.0.0.1:3000';


const httpMethods = {
    GET: "GET",
    POST: "POST",
    PATCH: 'PATCH',
    PUT: 'PUT',
    DELETE: 'DELETE'
};

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

const httpHeaders = {
    content: {
        json: { 'Content-Type': 'application/json' },
        xml: { 'Content-Type': 'application/xml' },
        form: { 'Content-Type': 'application/x-www-form-urlencoded' },
        pdf: { 'Content-Type': 'application/pdf' },
        text: { 'Content-Type': 'text/plain' },
        html: { 'Content-Type': 'text/html' },
        png: { 'Content-Type': 'image/png' },
        jpeg: { 'Content-Type': 'image/jpeg' },
        gif: { 'Content-Type': 'image/gif' },
        binary: { 'Content-Type': 'application/octet-stream' },
        formData: { 'Content-Type': 'multipart/form-data' },
    }
};

export {
    baseApiUrl,
    httpHeaders,
    httpMethods,
    statusCode
};