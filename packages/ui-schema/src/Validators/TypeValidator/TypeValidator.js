import {List, Map} from "immutable";

export const ERROR_WRONG_TYPE = 'wrong-type';

export const validateType = (value, type) => {
    const isInvalidType = (value, type) => {
        return typeof value !== type && typeof value !== 'undefined';
    };

    if(type === 'string') {
        return !isInvalidType(value, 'string');
    }
    if(type === 'number') {
        return !isInvalidType(value, 'number');
    }
    if(type === 'integer') {
        return !(!Number.isInteger(value) && typeof value !== 'undefined');
    }
    if(type === 'boolean') {
        return !isInvalidType(value, 'boolean');
    }
    if(type === 'array') {
        return !(!(Array.isArray(value) || List.isList(value)) && typeof value !== 'undefined');
    }
    if(type === 'object') {
        return !(!(typeof value === 'object' || Map.isMap(value)) && typeof value !== 'undefined') &&
            !(Array.isArray(value) || List.isList(value));
    }

    return false;
};

export const typeValidator = {
    validate: ({schema, value, errors, valid}) => {
        let type = schema.get('type');

        if(!validateType(value, type)) {
            valid = false;
            errors = errors.push(List([ERROR_WRONG_TYPE, Map({actual: typeof value})]));
        }

        return {errors, valid}
    }
};
