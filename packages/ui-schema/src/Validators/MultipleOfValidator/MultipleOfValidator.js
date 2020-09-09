import {Map} from 'immutable';

const ERROR_MULTIPLE_OF = 'multiple-of';

const validateMultipleOf = (schema, value) => {
    const type = schema.get('type');
    if((type === 'number' || type === 'integer') && typeof value !== 'undefined') {
        let multipleOf = schema.get('multipleOf');
        if(multipleOf && (value % multipleOf) !== 0) {
            return false;
        }
    }

    return true;
};

const multipleOfValidator = {
    validate: ({schema, value, errors, valid}) => {
        if(!validateMultipleOf(schema, value)) {
            valid = false;
            errors = errors.addError(ERROR_MULTIPLE_OF, Map({multipleOf: schema.get('multipleOf')}));
        }

        return {errors, valid}
    }
};

export {multipleOfValidator, ERROR_MULTIPLE_OF, validateMultipleOf}
