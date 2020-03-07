import {List, Map} from "immutable";

const ERROR_NOT_SET = 'required-not-set';

const checkValueExists = (type, value) => {
    const valType = typeof value;

    if(valType === 'undefined') {
        return false;
    }

    if(type === 'string') {
        return (valType === 'string' && value.trim().length);
    } else if(type === 'number' || type === 'integer') {
        // 0 is also a valid number, so not checking for false here
        return (valType === 'number')
    } else if(type === 'boolean') {
        // a required boolean property must be `true` to be considered set
        return (valType === 'boolean' && value);
    } else if(type === 'array') {
        // not checking content of array here, only if one item exists
        if(Array.isArray(value)) {
            if(!value.length) {
                return false;
            }
        } else if(List.isList(value)) {
            if(!value.size) {
                return false;
            }
        }

    } else if(type === 'object') {
        if(Map.isMap(value)) {
            /**
             * @var {Map} value
             */
            if(!value.keySeq().size) {
                return false;
            }
        } else if(valType === 'object') {
            if(!Object.keys(value).length) {
                return false;
            }
        }
    }

    return true;
};

const RequiredValidator = {
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

export {RequiredValidator, ERROR_NOT_SET, checkValueExists}
