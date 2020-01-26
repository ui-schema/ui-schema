import React from "react";
import {List, Map} from "immutable";
import {NextPluginRenderer} from "../Schema/Editor";

const ERROR_WRONG_TYPE = 'wrong-type';

const validateType = (value, type) => {
    const isInvalidType = (value, type) => {
        return typeof value !== type && typeof value !== 'undefined';
    };

    if(type === 'string') {
        return !isInvalidType(value, 'string');
    }
    if(type === 'number') {
        return !isInvalidType(value, 'number');
    }
    if(type === 'integer') {
        return !(!Number.isInteger(value) && typeof value !== 'undefined');
    }
    if(type === 'boolean') {
        return !isInvalidType(value, 'boolean');
    }
    if(type === 'array') {
        return !(!(Array.isArray(value) || List.isList(value)) && typeof value !== 'undefined');
    }
    if(type === 'object') {
        return !(!(typeof value === 'object' || Map.isMap(value)) && typeof value !== 'undefined');
    }

    return false;
};

const TypeValidator = (props) => {
    const {
        schema, value
    } = props;
    let {errors} = props;

    let {valid} = props;

    let type = schema.get('type');

    if(!validateType(value, type)) {
        valid = false;
        errors = errors.push(ERROR_WRONG_TYPE);
    }

    return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;
};

export {TypeValidator, ERROR_WRONG_TYPE, validateType}
