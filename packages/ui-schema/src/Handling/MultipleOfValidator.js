import React from "react";
import {NextPluginRenderer} from "../Schema/Editor";

const ERROR_MULTIPLE_OF = 'multiple-of';

const MultipleOfValidator = (props) => {
    const {
        schema, value
    } = props;
    let {errors} = props;

    let {valid} = props;

    let type = schema.get('type');

    if((type === 'number' || type === 'integer') && typeof value !== 'undefined') {
        let multipleOf = schema.get('multipleOf');
        if(multipleOf && (value % multipleOf) !== 0) {
            valid = false;
            errors = errors.push([ERROR_MULTIPLE_OF, multipleOf]);
        }
    }

    return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;
};

export {MultipleOfValidator, ERROR_MULTIPLE_OF}
