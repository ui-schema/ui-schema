import {List, Map} from 'immutable';
import {schemaTypeIsAny} from '@ui-schema/ui-schema/Utils/schemaTypeIs';

export const ERROR_ENUM_MISMATCH = 'enum-mismatch';

export const validateEnum = (type, _enum, value) => {
    if(typeof _enum === 'undefined' || typeof value === 'undefined' || typeof type === 'undefined') return true;

    if(schemaTypeIsAny(type, ['string', 'number', 'integer', 'boolean', 'null'])) {
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
        let type = schema.get('type');

        if(!validateEnum(type, schema.get('enum'), value)) {
            valid = false;
            errors = errors.addError(ERROR_ENUM_MISMATCH, Map({enum: schema.get('enum')}));
        }

        return {errors, valid}
    },
};
