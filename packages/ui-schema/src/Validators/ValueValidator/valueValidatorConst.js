import {Map} from 'immutable';

export const ERROR_CONST_MISMATCH = 'const-mismatch';

export const validateConst = (_const, value) => {
    return typeof _const === 'undefined' || (typeof _const === 'undefined' && typeof value === 'undefined') ?
        // todo: add deep check with List/Map.equals
        true : (value === _const);
};

export const valueValidatorConst = {
    should: ({schema, value}) => {
        let _const = schema.get('const');

        return typeof _const !== 'undefined' && typeof value !== 'undefined'
    },
    handle: ({schema, value, errors, valid}) => {
        if(!validateConst(schema.get('const'), value)) {
            valid = false;
            errors = errors.addError(ERROR_CONST_MISMATCH, Map({const: schema.get('const')}));
        }

        return {errors, valid}
    },
};
