import React from "react";
import {NextPluginRenderer} from "../Schema/Editor";

const ERROR_PATTERN = 'pattern-not-matching';

const PatternValidator = (props) => {
    const {
        schema, value
    } = props;
    let {errors} = props;

    let {valid} = props;

    let type = schema.get('type');

    if(type === 'string' && typeof value === 'string') {
        let pattern = schema.get('pattern');
        if(pattern && null === value.match(pattern)) {
            valid = false;
            errors = errors.push(ERROR_PATTERN);
        }
    }

    return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;
};

export {PatternValidator, ERROR_PATTERN}
