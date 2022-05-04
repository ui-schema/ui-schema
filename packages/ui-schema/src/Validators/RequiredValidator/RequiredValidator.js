import {List} from 'immutable';
import {schemaTypeIs, schemaTypeIsNumeric} from '@ui-schema/ui-schema';

const ERROR_NOT_SET = 'required-not-set';

const checkValueExists = (type, value) => {
    const valType = typeof value;

    if(valType === 'undefined') {
        return false;
    }

    if(schemaTypeIs(type, 'string') && valType === 'string') {
        return value !== '';
    } else if(valType === 'string' && schemaTypeIsNumeric(type)) {
        // 0 is also a valid number, so not checking for false here
        return value !== ''
    }

    return true;
};

const requiredValidator = {
    should: ({requiredList, storeKeys}) => {
        if(requiredList && List.isList(requiredList)) {
            return requiredList.contains(storeKeys.last());
        }
        return false
    },
    noHandle: () => ({required: false}),
    handle: ({schema, value, errors, valid}) => {
        let type = schema.get('type');
        if(!checkValueExists(type, value)) {
            valid = false;
            errors = errors.addError(ERROR_NOT_SET);
        }
        return {errors, valid, required: true}
    },
};

export {requiredValidator, ERROR_NOT_SET, checkValueExists}
