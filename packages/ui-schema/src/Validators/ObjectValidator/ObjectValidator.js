import {List, Map, Record} from 'immutable';
import {createValidatorErrors} from '@ui-schema/ui-schema/ValidatorErrors';
import {validateSchema} from '@ui-schema/ui-schema/validateSchema';
import {schemaTypeIs} from '@ui-schema/ui-schema/Utils/schemaTypeIs';

export const ERROR_ADDITIONAL_PROPERTIES = 'additional-properties';

export const validateObject = (schema, value) => {
    let err = createValidatorErrors();
    if(
        !schemaTypeIs(schema.get('type'), 'object') ||
        !(Map.isMap(value) || Record.isRecord(value) || typeof value === 'object') || List.isList(value) || Array.isArray(value)) {
        return err
    }
    if(schema.get('additionalProperties') === false && schema.get('properties') && typeof value === 'object') {
        let hasAdditional = false;
        const keys = Map.isMap(value) ? value.keySeq() : Object.keys(value);
        const schemaKeys = schema.get('properties').keySeq();
        keys.forEach(key => {
            // todo: add all invalid additional or change to `for key of value` to break after first invalid
            if(schemaKeys.indexOf(key) === -1) hasAdditional = true;
        });
        if(hasAdditional) {
            err = err.addError(ERROR_ADDITIONAL_PROPERTIES);
        }
    }

    if(schema.get('propertyNames') && typeof value === 'object') {
        const keys = Map.isMap(value) ? value.keySeq() : Object.keys(value);
        keys.forEach(key => {
            let tmp_err = validateSchema(schema.get('propertyNames').set('type', 'string'), key);
            if(tmp_err.hasError()) {
                err = err.addErrors(tmp_err);
            }
        });
    }

    return err;
};

export const objectValidator = {
    should: ({schema}) => {
        return schemaTypeIs(schema.get('type'), 'object')
    },
    handle: ({schema, value, errors, valid}) => {
        const objectErrors = validateObject(schema, value);
        if(objectErrors?.hasError()) {
            valid = false;
            errors = errors.addErrors(objectErrors);
        }
        return {errors, valid}
    },
};
