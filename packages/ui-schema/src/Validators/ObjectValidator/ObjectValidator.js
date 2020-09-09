import {Map} from "immutable";
import {validateSchema} from "../../validateSchema/index";
import {createValidatorErrors} from "@ui-schema/ui-schema/ValidityReporter/ValidatorErrors";

export const ERROR_ADDITIONAL_PROPERTIES = 'additional-properties';

/**
 * Return false when valid and string for an error
 *
 * @param schema
 * @param value
 * @return {List}
 */
export const validateObject = (schema, value) => {
    let err = createValidatorErrors();
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
            /*if(typeof tmp_err === 'string' || (List.isList(tmp_err) && tmp_err.size)) {
                if(List.isList(tmp_err)) {
                    err = err.concat(tmp_err);
                } else {
                    err = err.push(tmp_err);
                }
            }*/
        });
    }

    return err;
};

export const objectValidator = {
    should: ({schema}) => {
        let type = schema.get('type');

        return type === 'object'
    },
    validate: ({schema, value, errors, valid}) => {
        errors = validateObject(schema, value,);
        if(errors.hasError()) valid = false;
        return {errors, valid}
    }
};
