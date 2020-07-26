import {List} from "immutable";

export const ERROR_ENUM_MISMATCH = 'enum-mismatch';

export const validateEnum = (type, _enum, value) => {
    if(typeof _enum === 'undefined' || typeof value === 'undefined') return true;

    if(type === 'string' || type === 'number' || type === 'integer' || type === 'boolean') {
        // todo: should enum respect required?
        if(List.isList(_enum)) {
            if(!_enum.contains(value)) {
                return false;
            }
        } else if(Array.isArray(_enum)) {
            if(-1 === _enum.indexOf(value)) {
                return false;
            }
        }
    }

    return true;
};

export const valueValidatorEnum = {
    should: ({schema, value}) => {
        /**
         * @var {[]|List} _enum
         */
        let _enum = schema.get('enum');

        return typeof _enum !== 'undefined' && typeof value !== 'undefined'
    },
    validate: ({schema, value, errors, valid}) => {
        let type = schema.get('type');

        if(!validateEnum(type, schema.get('enum'), value)) {
            valid = false;
            errors = errors.push(ERROR_ENUM_MISMATCH);
        }

        return {errors, valid}
    }
};
