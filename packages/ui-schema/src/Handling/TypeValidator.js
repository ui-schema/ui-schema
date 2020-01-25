import React from "react";
import {List, Map} from "immutable";
import {NextPluginRenderer} from "../Schema/Editor";

const ERROR_WRONG_TYPE = 'wrong-type';
// const ERROR_NOT_SET = 'not-set';

const TypeValidator = (props) => {
    const {
        schema, value, errors = new List(),
    } = props;

    let {valid} = props;

    let type = schema.get('type');

    const validateType = (value, type) => {
        /*
         * Undefined failure depends on required
        if(typeof value === 'undefined') {
            valid = false;
            errors.push(ERROR_NOT_SET);
        }
         */
        if(typeof value !== type && typeof value !== 'undefined') {
            valid = false;
            errors.push(ERROR_WRONG_TYPE);
        }
    };

    if(type === 'string') {
        validateType(value, 'string');
    } else if(type === 'number') {
        validateType(value, 'number');
    } else if(type === 'integer') {
        if(!Number.isInteger(value) && typeof value !== 'undefined') {
            valid = false;
            errors.push(ERROR_WRONG_TYPE);
        }
    } else if(type === 'boolean') {
        validateType(value, 'boolean');
    } else if(type === 'array') {
        if(!(Array.isArray(value) || List.isList(value)) && typeof value !== 'undefined') {
            valid = false;
            errors.push(ERROR_WRONG_TYPE);
        }
    } else if(type === 'object') {
        if(!(typeof value === 'object' || Map.isMap(value)) && typeof value !== 'undefined') {
            valid = false;
            errors.push(ERROR_WRONG_TYPE);
        }
    }


    return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;
};

export {TypeValidator, ERROR_WRONG_TYPE}
