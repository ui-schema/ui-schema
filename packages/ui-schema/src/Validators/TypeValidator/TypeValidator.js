import {List, Map, Record} from 'immutable';

export const ERROR_WRONG_TYPE = 'wrong-type';

export const validateType = (value, type) => {
    if(typeof value === 'undefined' || typeof type === 'undefined') return true;

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
            !(Array.isArray(value) || List.isList(value)) &&
            (typeof value === 'object' || Map.isMap(value) || Record.isRecord(value))
        );
    }

    if(type === 'null') {
        return null === value;
    }

    return false;
};

export const validateTypes = (value, type) => {
    if(typeof value === 'undefined') return true;

    if(typeof type === 'string') {
        type = List([type])
    }
    return type.reduce((c, t) => c || validateType(value, t), false)
};

export const typeValidator = {
    handle: ({schema, value, errors, valid}) => {
        let type = schema.get('type');

        if(typeof type !== 'undefined' && !validateTypes(value, type)) {
            valid = false;
            errors = errors.addError(ERROR_WRONG_TYPE, Map({
                actual:
                    value === null ? 'null' :
                        List.isList(value) ? 'array' :
                            Map.isMap(value) || Record.isRecord(value) ? 'object' :
                                typeof value,
            }));
        }

        return {errors, valid}
    },
};
