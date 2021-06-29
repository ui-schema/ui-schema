import {List, Map} from 'immutable';

export const ERROR_WRONG_TYPE = 'wrong-type';

export const validateType = (value, type) => {
    if(typeof value === 'undefined') return true;

    const isValidType = (value, type) => {
        return typeof value === type;
    };

    if(type === 'string') {
        return isValidType(value, 'string');
    }
    if(type === 'number') {
        return isValidType(value, 'number');
    }
    if(type === 'integer') {
        return !isNaN(value) && Number.isInteger(value);
    }
    if(type === 'boolean') {
        return isValidType(value, 'boolean');
    }
    if(type === 'array') {
        return Array.isArray(value) || List.isList(value);
    }
    if(type === 'object') {
        return null !== value && (
            (typeof value === 'object' || Map.isMap(value)) &&
            !(Array.isArray(value) || List.isList(value))
        );
    }

    if(type === 'null') {
        return null === value;
    }

    return false;
};

export const typeValidator = {
    handle: ({schema, value, errors, valid}) => {
        let type = schema.get('type');

        if(!validateType(value, type)) {
            valid = false;
            errors = errors.addError(ERROR_WRONG_TYPE, Map({actual: typeof value}));
        }

        return {errors, valid}
    },
};
