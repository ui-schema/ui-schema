import React from "react";
import {List, Map} from "immutable";
import {NextPluginRenderer} from "../Schema/EditorWidgetStack";

const ERROR_NOT_SET = 'required-not-set';

const RequiredValidator = (props) => {
    const {
        ownKey, required, schema, value
    } = props;

    let {errors} = props;

    let {valid} = props;

    let type = schema.get('type');

    let isRequired = false;
    if(required && List.isList(required)) {
        isRequired = required.contains(ownKey);
    }

    const valType = typeof value;

    if(!isRequired) return <NextPluginRenderer {...props} valid={valid} errors={errors} required={false}/>;

    if(valType === 'undefined') {
        valid = false;
        errors = errors.push(ERROR_NOT_SET);
        return <NextPluginRenderer {...props} valid={valid} errors={errors} required/>;
    }

    if(type === 'string') {
        if(!(valType === 'string' && value.trim().length)) {
            valid = false;
            errors = errors.push(ERROR_NOT_SET);
        }
    } else if(type === 'number' || type === 'integer') {
        if(valType !== 'number') {
            // 0 is also a valid number, so not checking for false here
            valid = false;
            errors = errors.push(ERROR_NOT_SET);
        }
    } else if(type === 'boolean') {
        if(!(valType === 'boolean' && value)) {
            // a required boolean property must be `true` to be considered set
            valid = false;
            errors = errors.push(ERROR_NOT_SET);
        }
    } else if(type === 'array') {
        // todo: should work in conjunction with `minItems` and `maxItems`
        // not checking content of array here, only if one item exists
        if(Array.isArray(value)) {
            if(!value.length) {
                valid = false;
                errors = errors.push(ERROR_NOT_SET);
            }
        } else if(List.isList(value)) {
            if(!value.size) {
                valid = false;
                errors = errors.push(ERROR_NOT_SET);
            }
        }

    } else if(type === 'object') {
        if(Map.isMap(value)) {
            /**
             * @var {Map} value
             */
            if(!value.keySeq().size) {
                valid = false;
                errors = errors.push(ERROR_NOT_SET);
            }
        } else if(valType === 'object') {
            if(!Object.keys(value).length) {
                valid = false;
                errors = errors.push(ERROR_NOT_SET);
            }
        }
    }

    return <NextPluginRenderer {...props} valid={valid} errors={errors} required/>;
};

export {RequiredValidator, ERROR_NOT_SET}
