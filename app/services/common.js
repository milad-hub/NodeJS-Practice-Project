const { handleInternalServerError } = require('../helpers/error-handler');

class CommonServices {

    isNumeric(value) {
        return !isNaN(value);
    };

    isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    };

    checkUserExists(user) {
        if (!user) {
            throw new Error('User not found!');
        }
    };

    checkSchemaMatch(schema, model, res) {

        const validKeys = Object.keys(schema.obj);

        for (const key in model) {
            if (!validKeys.includes(key)) {
                return handleInternalServerError(res);
            }

            const value = model[key];
            const { instance: type, isRequired: required } = schema.paths[key];

            if (required && (value === undefined || value === null)) {
                return handleInternalServerError(res);
            }

            switch (type) {
                case 'String':
                    if (typeof value !== 'string') {
                        return handleInternalServerError(res);
                    }
                    break;
                case 'Number':
                    if (typeof value !== 'number' || !isNumeric(value)) {
                        return handleInternalServerError(res);
                    }
                    break;
                case 'Boolean':
                    if (typeof value !== 'boolean') {
                        return handleInternalServerError(res);
                    }
                    break;
                default:
                    break;
            }
        }

        return true;
    };

    checkAndFilterQuery(schema, query) {
        const validKeys = Object.keys(schema.paths);
        const filteredQuery = {};

        for (const key in query) {
            if (validKeys.includes(key)) {
                const value = query[key];
                const instance = schema.paths[key].instance;

                switch (instance) {
                    case 'Number':
                        handleNumberInstance(value, filteredQuery, key);
                        break;
                    case 'String':
                    case 'Boolean':
                        handleStringOrBooleanInstance(value, filteredQuery, key, instance);
                        break;
                }
            }
        }
        return filteredQuery;
    };

    handleAsyncErrors(fn) {
        return (req, res, next) => {
            fn(req, res, next).catch(next);
        };
    }

    //////////////////////////////////////////////////////////////////////////////////

    static handleNumberInstance(value, filteredQuery, key) {
        if (isNumeric(value)) {
            filteredQuery[key] = parseInt(value);
        } else if (isOperatorValue(value)) {
            const [operator, operatorValue] = extractOperatorValue(value);
            if (isNumeric(operatorValue)) {
                filteredQuery[key] = { [operator]: parseInt(operatorValue) };
            }
        }
    };

    static handleStringOrBooleanInstance(value, filteredQuery, key, instance) {
        if (instance === 'Boolean') {
            handleBooleanInstance(value, filteredQuery, key);
        } else {
            if (isOperatorValue(value)) {
                const [operator, operatorValue] = extractOperatorValue(value);
                filteredQuery[key] = { [operator]: operatorValue };
            } else {
                filteredQuery[key] = value;
            }
        }
    };

    static handleBooleanInstance(value, filteredQuery, key) {
        if (isBoolean(value)) {
            filteredQuery[key] = parseBoolean(value);
        }
    };

    static isOperatorValue(value) {
        return value.startsWith('$');
    };

    static extractOperatorValue(value) {
        const operatorIndex = value.indexOf(':');
        const operator = '$' + value.substring(1, operatorIndex);
        const operatorValue = value.substring(operatorIndex + 1);
        return [operator, operatorValue];
    };

    static isBoolean(value) {
        return value === 'true' || value === 'false';
    };

    static parseBoolean(value) {
        return value === 'true';
    };
}



module.exports = {
    CommonServices
};