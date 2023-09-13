const { handleInternalServerError } = require('../helpers/error-handler');

class CommonServices {

    isNumeric(value) {
        return !isNaN(value);
    };

    isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    };

    checkSchemaMatch(schema, model, next) {

        const validKeys = Object.keys(schema.obj);

        for (const key in model) {
            if (!validKeys.includes(key)) {
                return handleInternalServerError(next);
            }

            const value = model[key];
            const { instance: type, isRequired: required } = schema.paths[key];

            if (required && (value === undefined || value === null)) {
                return handleInternalServerError(next);
            }

            switch (type) {
                case 'String':
                    if (typeof value !== 'string') {
                        return handleInternalServerError(next);
                    }
                    break;
                case 'Number':
                    if (typeof value !== 'number' || !this.isNumeric(value)) {
                        return handleInternalServerError(next);
                    }
                    break;
                case 'Boolean':
                    if (typeof value !== 'boolean') {
                        return handleInternalServerError(next);
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
                        CommonServices.handleNumberInstance(value, filteredQuery, key);
                        break;
                    case 'String':
                    case 'Boolean':
                        CommonServices.handleStringOrBooleanInstance(value, filteredQuery, key, instance);
                        break;
                }
            }
        }
        return filteredQuery;
    };

    //////////////////////////////////////////////////////////////////////////////////

    static handleNumberInstance(value, filteredQuery, key) {
        if (CommonServices.isNumeric(value)) {
            filteredQuery[key] = parseInt(value);
        } else if (CommonServices.isOperatorValue(value)) {
            const [operator, operatorValue] = CommonServices.extractOperatorValue(value);
            if (CommonServices.isNumeric(operatorValue)) {
                filteredQuery[key] = { [operator]: parseInt(operatorValue) };
            }
        }
    };

    static handleStringOrBooleanInstance(value, filteredQuery, key, instance) {
        if (instance === 'Boolean') {
            CommonServices.handleBooleanInstance(value, filteredQuery, key);
        } else {
            if (CommonServices.isOperatorValue(value)) {
                const [operator, operatorValue] = CommonServices.extractOperatorValue(value);
                filteredQuery[key] = { [operator]: operatorValue };
            } else {
                filteredQuery[key] = value;
            }
        }
    };

    static handleBooleanInstance(value, filteredQuery, key) {
        if (CommonServices.isBoolean(value)) {
            filteredQuery[key] = CommonServices.parseBoolean(value);
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