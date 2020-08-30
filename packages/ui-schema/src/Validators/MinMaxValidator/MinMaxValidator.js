import {List, Map} from "immutable";

export const ERROR_MIN_LENGTH = 'min-length';
export const ERROR_MAX_LENGTH = 'max-length';

/**
 *
 * @param type
 * @param schema
 * @param value
 * @param strict
 * @return {List<any>}
 */
export const validateMinMax = (schema, value) => {
    const type = schema.get('type');
    let errors = List();
    if(typeof value === 'undefined') return errors

    if(type === 'string') {
        let minLength = schema.get('minLength');
        let maxLength = schema.get('maxLength');

        if(typeof value === 'string') {
            if(minLength) {
                if(value.length < minLength) {
                    // when not `strict` and empty string it is okay
                    errors = errors.push(List([ERROR_MIN_LENGTH, Map({min: minLength})]));
                }
            }
            if(maxLength) {
                if(value.length > maxLength) {
                    // when not `strict` and empty string it is okay
                    errors = errors.push(List([ERROR_MAX_LENGTH, Map({max: maxLength})]));
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
                    errors = errors.push(List([ERROR_MIN_LENGTH, Map({min: minItems})]));
                }
            } else if(Array.isArray(value)) {
                if(value.length < minItems) {
                    errors = errors.push(List([ERROR_MIN_LENGTH, Map({min: minItems})]));
                }
            }
        }

        if(maxItems) {
            if(List.isList(value)) {
                if(value.size > maxItems) {
                    errors = errors.push(List([ERROR_MAX_LENGTH, Map({max: maxItems})]));
                }
            } else if(Array.isArray(value)) {
                if(value.length > maxItems) {
                    errors = errors.push(List([ERROR_MAX_LENGTH, Map({max: maxItems})]));
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
                    errors = errors.push(List([ERROR_MIN_LENGTH, Map({min: minProperties})]));
                }
            } else if(typeof value === 'object') {
                if(Object.keys(value).length < minProperties) {
                    errors = errors.push(List([ERROR_MIN_LENGTH, Map({min: minProperties})]));
                }
            }
        }

        if(maxProperties) {
            if(Map.isMap(value)) {
                if(value.keySeq().size > maxProperties) {
                    errors = errors.push(List([ERROR_MAX_LENGTH, Map({max: maxProperties})]));
                }
            } else if(typeof value === 'object') {
                if(Object.keys(value).length > maxProperties) {
                    errors = errors.push(List([ERROR_MAX_LENGTH, Map({max: maxProperties})]));
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
                // when not `strict` and value is zero it is okay
                if(value < minimum) {
                    errors = errors.push(List([ERROR_MIN_LENGTH, Map({min: minimum})]));
                }
            }
            if(typeof exclusiveMinimum === 'number') {
                // when not `strict` and value is zero it is okay
                if(value <= exclusiveMinimum) {
                    errors = errors.push(List([ERROR_MIN_LENGTH, Map({exclMin: exclusiveMinimum})]));
                }
            }
            if(typeof maximum === 'number') {
                // when not `strict` and value is zero it is okay
                if(value > maximum) {
                    errors = errors.push(List([ERROR_MAX_LENGTH, Map({max: maximum})]));
                }
            }
            if(typeof exclusiveMaximum === 'number') {
                // when not `strict` and value is zero it is okay
                if(value >= exclusiveMaximum) {
                    errors = errors.push(List([ERROR_MAX_LENGTH, Map({exclMax: exclusiveMaximum})]));
                }
            }
        }
    }

    return errors;
};

export const minMaxValidator = {
    validate: ({schema, value, errors, valid}) => {
        let err = validateMinMax(schema, value);

        if(err.size) {
            valid = false;
            errors = errors.concat(err);
        }
        return {errors, valid}
    }
};
