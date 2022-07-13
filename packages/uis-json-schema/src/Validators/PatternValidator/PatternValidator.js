import {Map} from 'immutable';
import {schemaTypeIs} from '@ui-schema/system/schemaTypeIs';

const ERROR_PATTERN = 'pattern-not-matching';

const validatePattern = (type, value, pattern) => {
    if(schemaTypeIs(type, 'string') && typeof value === 'string' && pattern) {
        return null !== value.match(pattern);
    }

    return true;
};

const patternValidator = {
    handle: ({schema, value, errors, valid}) => {
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
