import React from "react";
import {List} from "immutable";
import {NextPluginRenderer} from "../Schema/EditorWidgetStack";

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
const validateMinMax = (type, schema, value, strict) => {
    let errors = List();
    if(type === 'string') {
        let minLength = schema.get('minLength');
        let maxLength = schema.get('maxLength');

        if(typeof value === 'string') {
            if(minLength) {
                if(!(!strict && 0 === value.length) && value.length < minLength) {
                    // when not `strict` and empty string it is okay
                    errors = errors.push(ERROR_MIN_LENGTH);
                }
            }
            if(maxLength) {
                if(!(!strict && 0 === value.length) && value.length > maxLength) {
                    // when not `strict` and empty string it is okay
                    errors = errors.push(ERROR_MAX_LENGTH);
                }
            }
        }
    }
    if(type === 'array') {
        let minItems = schema.get('minItems');
        let maxItems = schema.get('maxItems');
        if(minItems) {
            if(!value || value.size < minItems) {
                errors = errors.push(ERROR_MIN_LENGTH);
            }
        }
        if(maxItems) {
            if(!value || value.size > maxItems) {
                errors = errors.push(ERROR_MAX_LENGTH);
            }
        }
    }

    if(type === 'object') {

        let minProperties = schema.get('minProperties');
        let maxProperties = schema.get('maxProperties');
        let properties = schema.get('properties');

        if(properties) {
            if(Map.isMap(properties) || List.isList(properties)) {
                let numberOfProperties = schema.getIn(['properties']).keySeq().size;

                if(minProperties && numberOfProperties < minProperties) {
                    errors = errors.push(ERROR_MIN_LENGTH);
                }
                if(maxProperties && numberOfProperties > maxProperties) {
                    errors = errors.push(ERROR_MAX_LENGTH);
                }

            } else if(Array.isArray(properties)) {
                let numberOfProperties = properties.length;

                if(minProperties && numberOfProperties < minProperties) {
                    errors = errors.push(ERROR_MIN_LENGTH);
                }
                if(maxProperties && numberOfProperties > maxProperties) {
                    errors = errors.push(ERROR_MAX_LENGTH);
                }
            }
        }
    }

    if(type === 'number') {
        let minimum = schema.get('minimum');
        let exclusiveMinimum = schema.get('exclusiveMinimum');
        let maximum = schema.get('maximum');
        let exclusiveMaximum = schema.get('exclusiveMaximum');

        if(typeof value === 'number') {
            let notStrictAndZero = (!strict && 0 === value);
            if(!notStrictAndZero && minimum) {
                // when not `strict` and value is zero it is okay
                if(value < minimum) {
                    errors = errors.push(ERROR_MIN_LENGTH);
                }
            }
            if(!notStrictAndZero && exclusiveMinimum) {
                // when not `strict` and value is zero it is okay
                if(value <= exclusiveMinimum) {
                    errors = errors.push(ERROR_MIN_LENGTH);
                }
            }
            if(!notStrictAndZero && maximum) {
                // when not `strict` and value is zero it is okay
                if(value > maximum) {
                    errors = errors.push(ERROR_MAX_LENGTH);
                }
            }
            if(!notStrictAndZero && exclusiveMaximum) {
                // when not `strict` and value is zero it is okay
                if(value >= exclusiveMaximum) {
                    errors = errors.push(ERROR_MAX_LENGTH);
                }
            }
        }
    }

    return errors;
};

const MinMaxValidator = (props) => {
    const {
        schema, value,
        required,
    } = props;

    let {errors} = props;

    let {valid} = props;

    let type = schema.get('type');

    let err = validateMinMax(type, schema, value, required);

    if(err.size) {
        valid = false;
        errors = errors.concat(err);
    }

    return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;
};

export {MinMaxValidator, ERROR_MAX_LENGTH, ERROR_MIN_LENGTH, validateMinMax}