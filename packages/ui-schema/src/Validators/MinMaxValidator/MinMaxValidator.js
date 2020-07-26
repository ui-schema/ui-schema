import {List, Map} from "immutable";

const ERROR_MIN_LENGTH = 'min-length';
const ERROR_MAX_LENGTH = 'max-length';

/**
 *
 * @param type
 * @param schema
 * @param value
 * @param strict
 * @return {List<any>}
 */
const validateMinMax = (schema, value, strict) => {
    const type = schema.get('type');
    let errors = List();
    if(type === 'string') {
        let minLength = schema.get('minLength');
        let maxLength = schema.get('maxLength');

        if(typeof value === 'string') {
            if(minLength) {
                if(!(!strict && 0 === value.length) && value.length < minLength) {
                    // when not `strict` and empty string it is okay
                    errors = errors.push(List([ERROR_MIN_LENGTH, Map({min: minLength})]));
                }
            }
            if(maxLength) {
                if(!(!strict && 0 === value.length) && value.length > maxLength) {
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
                if(!(!strict && 0 === value.size) && value.size < minItems) {
                    errors = errors.push(List([ERROR_MIN_LENGTH, Map({min: minItems})]));
                }
            } else if(Array.isArray(value)) {
                if(!(!strict && 0 === value.length) && value.length < minItems) {
                    errors = errors.push(List([ERROR_MIN_LENGTH, Map({min: minItems})]));
                }
            }
        }

        if(maxItems) {
            if(List.isList(value)) {
                if(!(!strict && 0 === value.size) && value.size > maxItems) {
                    errors = errors.push(List([ERROR_MAX_LENGTH, Map({max: maxItems})]));
                }
            } else if(Array.isArray(value)) {
                if(!(!strict && 0 === value.length) && value.length > maxItems) {
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
                if(!(!strict && 0 === value.keySeq().size) && value.keySeq().size < minProperties) {
                    errors = errors.push(List([ERROR_MIN_LENGTH, Map({min: minProperties})]));
                }
            } else if(typeof value === 'object') {
                if(!(!strict && 0 === Object.keys(value).length) && Object.keys(value).length < minProperties) {
                    errors = errors.push(List([ERROR_MIN_LENGTH, Map({min: minProperties})]));
                }
            }
        }

        if(maxProperties) {
            if(Map.isMap(value)) {
                if(!(!strict && 0 === value.keySeq().size) && value.keySeq().size > maxProperties) {
                    errors = errors.push(List([ERROR_MAX_LENGTH, Map({max: maxProperties})]));
                }
            } else if(typeof value === 'object') {
                if(!(!strict && 0 === Object.keys(value).length) && Object.keys(value).length > maxProperties) {
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
            let notStrictAndZero = (!strict && 0 === value);
            if(!notStrictAndZero && typeof minimum === 'number') {
                // when not `strict` and value is zero it is okay
                if(value < minimum) {
                    errors = errors.push(List([ERROR_MIN_LENGTH, Map({min: minimum})]));
                }
            }
            if(!notStrictAndZero && typeof exclusiveMinimum === 'number') {
                // when not `strict` and value is zero it is okay
                if(value <= exclusiveMinimum) {
                    errors = errors.push(List([ERROR_MIN_LENGTH, Map({exclMin: exclusiveMinimum})]));
                }
            }
            if(!notStrictAndZero && typeof maximum === 'number') {
                // when not `strict` and value is zero it is okay
                if(value > maximum) {
                    errors = errors.push(List([ERROR_MAX_LENGTH, Map({max: maximum})]));
                }
            }
            if(!notStrictAndZero && typeof exclusiveMaximum === 'number') {
                // when not `strict` and value is zero it is okay
                if(value >= exclusiveMaximum) {
                    errors = errors.push(List([ERROR_MAX_LENGTH, Map({exclMax: exclusiveMaximum})]));
                }
            }
        }
    }

    return errors;
};

const minMaxValidator = {
    validate: ({required, schema, value, errors, valid}) => {
        let err = validateMinMax(schema, value, required);

        if(err.size) {
            valid = false;
            errors = errors.concat(err);
        }
        return {errors, valid}
    }
};

export {minMaxValidator, ERROR_MAX_LENGTH, ERROR_MIN_LENGTH, validateMinMax}
