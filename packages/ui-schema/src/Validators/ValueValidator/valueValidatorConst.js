import {Map} from "immutable";

export const ERROR_CONST_MISMATCH = 'const-mismatch';

/**
 *
 * @param type
 * @param _const
 * @param value
 * @return {boolean|boolean}
 */
export const validateConst = (type, _const, value) => {

    return typeof _const === 'undefined' || typeof value === 'undefined' || (
        (type === 'string' || type === 'number' || type === 'integer' || type === 'boolean')
        &&
        (value === _const)
    );
};

export const valueValidatorConst = {
    should: ({schema, value}) => {
        let _const = schema.get('const');

        return typeof _const !== 'undefined' && typeof value !== 'undefined'
    },
    validate: ({schema, value, errors, valid}) => {
        let type = schema.get('type');

        if(!validateConst(type, schema.get('const'), value)) {
            valid = false;
            errors = errors.addError(ERROR_CONST_MISMATCH, Map({const: schema.get('const')}));
        }

        return {errors, valid}
    }
};
