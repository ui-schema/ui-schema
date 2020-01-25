import React from "react";
import {NextPluginRenderer} from "../Schema/Editor";

const ERROR_MIN_LENGTH = 'min-length';
const ERROR_MAX_LENGTH = 'max-length';

const MinMaxValidator = (props) => {
    const {
        schema, value,
        required,
    } = props;

    let {errors} = props;

    let {valid} = props;

    let type = schema.get('type');

    if(type === 'string') {
        let minLength = schema.get('minLength');
        let maxLength = schema.get('maxLength');

        if(typeof value === 'string') {
            if(minLength) {
                if(!(!required && 0 === value.length) && value.length < minLength) {
                    // when not required and empty string it is okay
                    valid = false;
                    errors = errors.push(ERROR_MIN_LENGTH);
                }
            }
            if(maxLength) {
                if(!(!required && 0 === value.length) && value.length > maxLength) {
                    // when not required and empty string it is okay
                    valid = false;
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
                    valid = false;
                    errors = errors.push(ERROR_MIN_LENGTH);
                }
            }
            if(!notRequiredAndZero && exclusiveMinimum) {
                // when not required and value is zero it is okay
                if(value <= exclusiveMinimum) {
                    valid = false;
                    errors = errors.push(ERROR_MIN_LENGTH);
                }
            }
            if(!notRequiredAndZero && maximum) {
                // when not required and value is zero it is okay
                if(value > maximum) {
                    valid = false;
                    errors = errors.push(ERROR_MAX_LENGTH);
                }
            }
            if(!notRequiredAndZero && exclusiveMaximum) {
                // when not required and value is zero it is okay
                if(value >= exclusiveMaximum) {
                    valid = false;
                    errors = errors.push(ERROR_MAX_LENGTH);
                }
            }
        }
    }

    return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;
};

export {MinMaxValidator, ERROR_MAX_LENGTH, ERROR_MIN_LENGTH}
