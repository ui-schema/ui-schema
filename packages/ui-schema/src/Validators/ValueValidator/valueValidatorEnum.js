import {fromJS, List, Map} from 'immutable';

export const ERROR_ENUM_MISMATCH = 'enum-mismatch';

export const validateEnum = (_enum, value) => {
    if(typeof _enum === 'undefined' || typeof value === 'undefined') return true;

    if(Array.isArray(_enum)) {
        _enum = List(fromJS(_enum))
    }

    if(value !== null && typeof value === 'object') {
        if(Array.isArray(value)) {
            value = List(fromJS(value))
        } else if(!List.isList(value) && !Map.isMap(value)) {
            value = Map(fromJS(value))
        }
        if(List.isList(value) || Map.isMap(value)) {
            for(const enm of _enum) {
                if(value.equals(enm)) {
                    return true
                }
            }
            return false
        }
    }

    if(List.isList(_enum)) {
        if(!_enum.contains(value)) {
            return false;
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
    handle: ({schema, value, errors, valid}) => {
        if(!validateEnum(schema.get('enum'), value)) {
            valid = false;
            errors = errors.addError(ERROR_ENUM_MISMATCH, Map({enum: schema.get('enum')}));
        }

        return {errors, valid}
    },
};
