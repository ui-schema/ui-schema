import {List, Map, Record} from 'immutable';
import {createValidatorErrors} from '@ui-schema/system/ValidatorErrors';
import {validateSchema} from '@ui-schema/json-schema/validateSchema';
import {schemaTypeIs} from '@ui-schema/system/schemaTypeIs';

export const ERROR_ADDITIONAL_PROPERTIES = 'additional-properties';

export const validateObject = (schema, value, recursively = false) => {
    let err = createValidatorErrors();
    const isRealObject = typeof value !== 'undefined' &&
        ((typeof value === 'object' && value !== null) || Map.isMap(value) || Record.isRecord(value)) &&
        !(List.isList(value) || Array.isArray(value))

    if(schema.get('additionalProperties') === false && schema.get('properties') && isRealObject) {
        let hasAdditional = false;
        const keys = Map.isMap(value) || Record.isRecord(value) ? value.keySeq() : Object.keys(value);
        const schemaKeys = schema.get('properties').keySeq();
        keys.forEach(key => {
            // todo: add all invalid additional or change to `for key of value` to break after first invalid
            if(schemaKeys.indexOf(key) === -1) hasAdditional = true;
        });
        if(hasAdditional) {
            err = err.addError(ERROR_ADDITIONAL_PROPERTIES);
        }
    }

    if(schema.get('propertyNames') && isRealObject) {
        const keys = Map.isMap(value) || Record.isRecord(value) ? value.keySeq() : Object.keys(value);
        keys.forEach(key => {
            let tmp_err = validateSchema(schema.get('propertyNames').set('type', 'string'), key, recursively);
            if(tmp_err.hasError()) {
                err = err.addErrors(tmp_err);
            }
        });
    }

    if(recursively && schema.get('properties')) {
        schema.get('properties').forEach((subSchema, key) => {
            let val = isRealObject ? Map.isMap(value) || Record.isRecord(value) ? value.get(key) : value[key] : undefined;
            if(schema.get('required')?.contains(key) && !checkValueExists(subSchema.get('type'), val)) {
                err = err.addError(ERROR_NOT_SET);
                return;
            }

            let t = validateSchema(subSchema, val, recursively);
            if(t.hasError()) {
                err = err.addErrors(t);
            }
        })
    }

    return err;
};

export const objectValidator = {
    handle: ({schema, value, errors, valid}) => {
        const objectErrors = validateObject(schema, value);
        if(objectErrors?.hasError()) {
            valid = false;
            errors = errors.addErrors(objectErrors);
        }
        return {errors, valid}
    },
};
