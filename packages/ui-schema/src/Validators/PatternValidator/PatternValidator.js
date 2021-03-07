import {Map} from 'immutable';

const ERROR_PATTERN = 'pattern-not-matching';

/**
 * Return true if the pattern matches or no pattern applied or false otherwise
 * @param type
 * @param value
 * @param pattern
 * @return {*|boolean}
 */
const validatePattern = (type, value, pattern) => {
    if(type === 'string' && typeof value === 'string' && pattern) {
        return null !== value.match(pattern);
    }

    return true;
};

const patternValidator = {
    /**
     *
     * @param schema
     * @param value
     * @param ValidatorErrorsType errors
     * @param valid
     * @return {{valid: boolean, errors: *}}
     */
    validate: ({schema, value, errors, valid}) => {
        let type = schema.get('type');
        let pattern = schema.get('pattern');

        if(!validatePattern(type, value, pattern)) {
            valid = false;
            errors = errors.addError(ERROR_PATTERN, Map({pattern, patternError: schema.get('patternError')}));
        }

        return {errors, valid}
    },
};


export {patternValidator, ERROR_PATTERN, validatePattern}
