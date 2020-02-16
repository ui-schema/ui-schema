import React from "react";
import {NextPluginRenderer} from "../Schema/EditorWidgetStack";

const ERROR_PATTERN = 'pattern-not-matching';

/**
 * Return true if the pattern matches or no pattern applied or false otherwise
 * @param type
 * @param value
 * @param pattern
 * @return {*|boolean}
 */
const validatePattern = (type, value, pattern) => {
    if(type === 'string' && typeof value === 'string' && pattern) {
        return null !== value.match(pattern);
    }

    return true;
};

const validateNamePattern = (entry, pattern) => entry.match(pattern);

const PatternValidator = (props) => {
    const {
        schema, value
    } = props;
    let {errors} = props;

    let {valid} = props;

    let type = schema.get('type');
    let pattern = schema.get('pattern');

    if(!validatePattern(type, value, pattern)) {
        valid = false;
        errors = errors.push(ERROR_PATTERN);
    }

    return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;
};

export {PatternValidator, ERROR_PATTERN, validatePattern, validateNamePattern}
