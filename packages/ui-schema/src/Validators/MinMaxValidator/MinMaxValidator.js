import {List, Map} from "immutable";
import {createValidatorErrors} from "@ui-schema/ui-schema/ValidatorStack/ValidatorErrors";

export const ERROR_MIN_LENGTH = 'min-length';
export const ERROR_MAX_LENGTH = 'max-length';

export const validateMinMax = (schema, value) => {
    const type = schema.get('type');
    let errors = createValidatorErrors();
    if(typeof value === 'undefined') return errors

    if(type === 'string') {
        let minLength = schema.get('minLength');
        let maxLength = schema.get('maxLength');

        if(typeof value === 'string') {
            if(minLength) {
                if(value.length < minLength) {
                    errors = errors.addError(ERROR_MIN_LENGTH, Map({min: minLength}));
                }
            }
            if(maxLength) {
                if(value.length > maxLength) {
                    errors = errors.addError(ERROR_MAX_LENGTH, Map({max: maxLength}));
                }
            }
        }
    }

    if(type === 'array') {
        let minItems = schema.get('minItems');
        let maxItems = schema.get('maxItems');

        if(minItems) {
            if(List.isList(value)) {
                if(value.size < minItems) {
                    errors = errors.addError(ERROR_MIN_LENGTH, Map({min: minItems}));
                }
            } else if(Array.isArray(value)) {
                if(value.length < minItems) {
                    errors = errors.addError(ERROR_MIN_LENGTH, Map({min: minItems}));
                }
            }
        }

        if(maxItems) {
            if(List.isList(value)) {
                if(value.size > maxItems) {
                    errors = errors.addError(ERROR_MAX_LENGTH, Map({max: maxItems}));
                }
            } else if(Array.isArray(value)) {
                if(value.length > maxItems) {
                    errors = errors.addError(ERROR_MAX_LENGTH, Map({max: maxItems}));
                }
            }
        }
    }

    if(type === 'object') {
        let minProperties = schema.get('minProperties');
        let maxProperties = schema.get('maxProperties');

        if(minProperties) {
            if(Map.isMap(value)) {
                if(value.keySeq().size < minProperties) {
                    errors = errors.addError(ERROR_MIN_LENGTH, Map({min: minProperties}));
                }
            } else if(typeof value === 'object') {
                if(Object.keys(value).length < minProperties) {
                    errors = errors.addError(ERROR_MIN_LENGTH, Map({min: minProperties}));
                }
            }
        }

        if(maxProperties) {
            if(Map.isMap(value)) {
                if(value.keySeq().size > maxProperties) {
                    errors = errors.addError(ERROR_MAX_LENGTH, Map({max: maxProperties}));
                }
            } else if(typeof value === 'object') {
                if(Object.keys(value).length > maxProperties) {
                    errors = errors.addError(ERROR_MAX_LENGTH, Map({max: maxProperties}));
                }
            }
        }
    }

    if(type === 'number' || type === 'integer') {
        let minimum = schema.get('minimum');
        let exclusiveMinimum = schema.get('exclusiveMinimum');
        let maximum = schema.get('maximum');
        let exclusiveMaximum = schema.get('exclusiveMaximum');

        if(typeof value === 'number') {
            if(typeof minimum === 'number') {
                if(typeof exclusiveMinimum === 'boolean') {
                    if(exclusiveMinimum && value <= minimum) {
                        errors = errors.addError(ERROR_MIN_LENGTH, Map({exclMin: minimum}));
                    }
                } else if(value < minimum) {
                    errors = errors.addError(ERROR_MIN_LENGTH, Map({min: minimum}));
                }
            }

            if(typeof exclusiveMinimum === 'number') {
                if(value <= exclusiveMinimum) {
                    errors = errors.addError(ERROR_MIN_LENGTH, Map({exclMin: exclusiveMinimum}));
                }
            }
            if(typeof maximum === 'number') {
                if(typeof exclusiveMaximum === 'boolean') {
                    if(value >= maximum) {
                        errors = errors.addError(ERROR_MAX_LENGTH, Map({exclMax: maximum}));
                    }
                } else if(value > maximum) {
                    errors = errors.addError(ERROR_MAX_LENGTH, Map({max: maximum}));
                }
            }
            if(typeof exclusiveMaximum === 'number') {
                if(value >= exclusiveMaximum) {
                    errors = errors.addError(ERROR_MAX_LENGTH, Map({exclMax: exclusiveMaximum}));
                }
            }
        }
    }

    return errors;
};

export const minMaxValidator = {
    validate: ({schema, value, errors, valid}) => {
        let err = validateMinMax(schema, value);

        if(err.hasError()) {
            valid = false;
            errors = errors.addErrors(err);
        }
        return {errors, valid}
    }
};
