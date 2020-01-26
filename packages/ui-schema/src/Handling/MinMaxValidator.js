import React from "react";
import {List} from "immutable";
import {NextPluginRenderer} from "../Schema/Editor";

const ERROR_MIN_LENGTH = 'min-length';
const ERROR_MAX_LENGTH = 'max-length';

/**
 *
 * @param type
 * @param schema
 * @param value
 * @param required
 * @return {List<any>}
 */
const validateMinMax = (type, schema, value, required) => {
    let errors = List();
    if(type === 'string') {
        let minLength = schema.get('minLength');
        let maxLength = schema.get('maxLength');

        if(typeof value === 'string') {
            if(minLength) {
                if(!(!required && 0 === value.length) && value.length < minLength) {
                    // when not required and empty string it is okay
                    errors = errors.push(ERROR_MIN_LENGTH);
                }
            }
            if(maxLength) {
                if(!(!required && 0 === value.length) && value.length > maxLength) {
                    // when not required and empty string it is okay
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
            let notRequiredAndZero = (!required && 0 === value);
            if(!notRequiredAndZero && minimum) {
                // when not required and value is zero it is okay
                if(value < minimum) {
                    errors = errors.push(ERROR_MIN_LENGTH);
                }
            }
            if(!notRequiredAndZero && exclusiveMinimum) {
                // when not required and value is zero it is okay
                if(value <= exclusiveMinimum) {
                    errors = errors.push(ERROR_MIN_LENGTH);
                }
            }
            if(!notRequiredAndZero && maximum) {
                // when not required and value is zero it is okay
                if(value > maximum) {
                    errors = errors.push(ERROR_MAX_LENGTH);
                }
            }
            if(!notRequiredAndZero && exclusiveMaximum) {
                // when not required and value is zero it is okay
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
