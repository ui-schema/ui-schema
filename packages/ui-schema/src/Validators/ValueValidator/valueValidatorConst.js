import {Map} from 'immutable';
import {schemaTypeIsAny} from '@ui-schema/ui-schema/Utils/schemaTypeIs';

export const ERROR_CONST_MISMATCH = 'const-mismatch';

export const validateConst = (type, _const, value) => {

    return typeof _const === 'undefined' || typeof value === 'undefined' || (
        schemaTypeIsAny(type, ['string', 'number', 'integer', 'boolean', 'null'])
        &&
        (value === _const)
    );
};

export const valueValidatorConst = {
    should: ({schema, value}) => {
        let _const = schema.get('const');

        return typeof _const !== 'undefined' && typeof value !== 'undefined'
    },
    handle: ({schema, value, errors, valid}) => {
        let type = schema.get('type');

        if(!validateConst(type, schema.get('const'), value)) {
            valid = false;
            errors = errors.addError(ERROR_CONST_MISMATCH, Map({const: schema.get('const')}));
        }

        return {errors, valid}
    },
};
