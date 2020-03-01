import {List, Map} from 'immutable';

const ERROR_MULTIPLE_OF = 'multiple-of';

const validateMultipleOf = (type, schema, value) => {
    if((type === 'number' || type === 'integer') && typeof value !== 'undefined') {
        let multipleOf = schema.get('multipleOf');
        if(multipleOf && (value % multipleOf) !== 0) {
            return false;
        }
    }

    return true;
};

const MultipleOfValidator = {
    validate: ({schema, value, errors, valid}) => {
        let type = schema.get('type');

        if(!validateMultipleOf(type, schema, value)) {
            valid = false;
            errors = errors.push(List([ERROR_MULTIPLE_OF, Map({multipleOf: schema.get('multipleOf')})]));
        }

        return {errors, valid}
    }
};

export {MultipleOfValidator, ERROR_MULTIPLE_OF, validateMultipleOf}
