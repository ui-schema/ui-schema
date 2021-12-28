import {List, Map} from 'immutable';

export const ERROR_ENUM_MISMATCH = 'enum-mismatch';

export const validateEnum = (_enum, value) => {
    if(typeof _enum === 'undefined' || typeof value === 'undefined') return true;

    if(List.isList(_enum)) {
        if(!_enum.contains(value)) {
            return false;
        }
    } else if(Array.isArray(_enum)) {
        if(-1 === _enum.indexOf(value)) {
            return false;
        }
    }

    // todo: add missing `array`/`object` compare
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
    handle: ({schema, value, errors, valid}) => {
        if(!validateEnum(schema.get('enum'), value)) {
            valid = false;
            errors = errors.addError(ERROR_ENUM_MISMATCH, Map({enum: schema.get('enum')}));
        }

        return {errors, valid}
    },
};
