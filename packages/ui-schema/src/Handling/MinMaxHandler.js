import React from "react";
import {List} from "immutable";
import {NextPluginRenderer} from "../Schema/Editor";

const ERROR_MIN_LENGTH = 'min-length';
const ERROR_MAX_LENGTH = 'max-length';

const MinMaxHandler = (props) => {
    const {
        schema, value, errors = new List(),
    } = props;

    let {valid} = props;

    let type = schema.get('type');

    if(type === 'string') {
        let minLength = schema.get('minLength');
        let maxLength = schema.get('maxLength');
        if(minLength) {
            if(typeof value === 'string') {
                if(value.length < minLength) {
                    valid = false;
                    errors.push(ERROR_MIN_LENGTH);
                }
            } else {
                valid = false;
            }
        }
        if(maxLength) {
            if(typeof value === 'string') {
                if(value.length > maxLength) {
                    valid = false;
                    errors.push(ERROR_MAX_LENGTH);
                }
            } else {
                valid = false;
            }
        }
    }

    if(type === 'number') {
        let minimum = schema.get('minimum');
        /*let exclusiveMinimum = schema.get('exclusiveMinimum');
        let maximum = schema.get('maximum');
        let exclusiveMaximum = schema.get('exclusiveMaximum');*/

        // todo: implement number like https://json-schema.org/understanding-json-schema/reference/numeric.html
        console.log(minimum);
    }


    return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;
};

export {MinMaxHandler, ERROR_MAX_LENGTH, ERROR_MIN_LENGTH}
