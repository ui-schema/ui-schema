import React from "react";
import {List, Map} from "immutable";
import {NextPluginRenderer} from "../Schema/Editor";

const ERROR_WRONG_TYPE = 'wrong-type';

const TypeValidator = (props) => {
    const {
        schema, value
    } = props;
    let {errors} = props;

    let {valid} = props;

    let type = schema.get('type');

    const validateType = (value, type) => {
        if(typeof value !== type && typeof value !== 'undefined') {
            valid = false;
            errors = errors.push(ERROR_WRONG_TYPE);
        }
    };

    if(type === 'string') {
        validateType(value, 'string');
    } else if(type === 'number') {
        validateType(value, 'number');
    } else if(type === 'integer') {
        if(!Number.isInteger(value) && typeof value !== 'undefined') {
            valid = false;
            errors = errors.push(ERROR_WRONG_TYPE);
        }
    } else if(type === 'boolean') {
        validateType(value, 'boolean');
    } else if(type === 'array') {
        if(!(Array.isArray(value) || List.isList(value)) && typeof value !== 'undefined') {
            valid = false;
            errors = errors.push(ERROR_WRONG_TYPE);
        }
    } else if(type === 'object') {
        if(!(typeof value === 'object' || Map.isMap(value)) && typeof value !== 'undefined') {
            valid = false;
            errors = errors.push(ERROR_WRONG_TYPE);
        }
    }


    return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;
};

export {TypeValidator, ERROR_WRONG_TYPE}
