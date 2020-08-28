import {List} from "immutable";

const ERROR_NOT_SET = 'required-not-set';

const checkValueExists = (type, value) => {
    const valType = typeof value;

    if(valType === 'undefined') {
        return false;
    }

    if(type === 'string' && valType === 'string') {
        return value !== '';
    } else if(valType === 'string' && (type === 'number' || type === 'integer')) {
        // 0 is also a valid number, so not checking for false here
        return value !== ''
    } /*else if(type === 'boolean') {
        //
    } else if(type === 'array') {
        // not checking content of array here, only if one item exists
        // todo: really check type here?
        // return List.isList(value) || Array.isArray(value)
    } else if(type === 'object') {
        // todo: really check type here?
        // return valType === 'object' || Map.isMap(value)
    }*/

    return true;
};

const requiredValidator = {
    should: ({required, ownKey}) => {
        let isRequired = false;
        if(required && List.isList(required)) {
            isRequired = required.contains(ownKey);
        }
        return isRequired;
    },
    noValidate: () => ({required: false}),
    validate: ({schema, value, errors, valid}) => {
        let type = schema.get('type');
        if(!checkValueExists(type, value)) {
            valid = false;
            errors = errors.push(ERROR_NOT_SET);
        }
        return {errors, valid, required: true}
    }
};

export {requiredValidator, ERROR_NOT_SET, checkValueExists}
