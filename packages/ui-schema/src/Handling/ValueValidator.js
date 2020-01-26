import React from "react";
import {List} from "immutable";
import {NextPluginRenderer} from "../Schema/Editor";

const ERROR_CONST_MISMATCH = 'const-mismatch';
const ERROR_ENUM_MISMATCH = 'enum-mismatch';

const ValueValidatorEnum = (props) => {
    const {
        schema, value
    } = props;
    let {errors} = props;

    let {valid} = props;

    let type = schema.get('type');
    /**
     * @var {[]|List} _enum
     */
    let _enum = schema.get('enum');

    if(typeof _enum === 'undefined' || typeof value === 'undefined') return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;

    if(type === 'string' || type === 'number' || type === 'integer' || type === 'boolean') {
        // todo: should enum respect required?
        if(List.isList(_enum)) {
            if(!_enum.contains(value)) {
                valid = false;
                errors = errors.push(ERROR_ENUM_MISMATCH);
            }
        } else if(Array.isArray(_enum)) {
            if(-1 === _enum.indexOf(value)) {
                valid = false;
                errors = errors.push(ERROR_ENUM_MISMATCH);
            }
        }
    }

    return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;
};

const ValueValidatorConst = (props) => {
    const {
        schema, value
    } = props;
    let {errors} = props;

    let {valid} = props;

    let type = schema.get('type');
    let _const = schema.get('const');

    if(typeof _const === 'undefined' || typeof value === 'undefined') return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;

    if(type === 'string' || type === 'number' || type === 'integer' || type === 'boolean' || type === 'array' || type === 'object') {
        if(value !== _const) {
            // todo: should const respect required?
            valid = false;
            errors = errors.push(ERROR_CONST_MISMATCH);
        }
    }

    return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;
};

export {ValueValidatorConst, ValueValidatorEnum, ERROR_CONST_MISMATCH, ERROR_ENUM_MISMATCH}
