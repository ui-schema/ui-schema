import React from "react";
import {List, Map} from "immutable";
import {NextPluginRenderer} from "../Schema/EditorWidgetStack";

const ERROR_CONST_MISMATCH = 'const-mismatch';
const ERROR_ENUM_MISMATCH = 'enum-mismatch';

const validateEnum = (type, schema, value) => {
    /**
     * @var {[]|List} _enum
     */
    let _enum = schema.get('enum');

    if(typeof _enum === 'undefined' || typeof value === 'undefined') return true;

    if(type === 'string' || type === 'number' || type === 'integer' || type === 'boolean') {
        // todo: should enum respect required?
        if(List.isList(_enum)) {
            if(!_enum.contains(value)) {
                return false;
            }
        } else if(Array.isArray(_enum)) {
            if(-1 === _enum.indexOf(value)) {
                return false;
            }
        }
    }

    return true;
};

const ValueValidatorEnum = (props) => {
    const {schema, value} = props;
    let {errors, valid} = props;

    let type = schema.get('type');
    /**
     * @var {[]|List} _enum
     */
    let _enum = schema.get('enum');

    if(typeof _enum === 'undefined' || typeof value === 'undefined') return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;

    if(!validateEnum(type, schema, value)) {
        valid = false;
        errors = errors.push(ERROR_ENUM_MISMATCH);
    }

    return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;
};

/**
 *
 * @param type
 * @param schema
 * @param value
 * @return {boolean|boolean}
 */
const validateConst = (type, schema, value) => {
    let _const = schema.get('const');

    // todo: should const respect required?
    return typeof _const === 'undefined' || typeof value === 'undefined' || (
        (type === 'string' || type === 'number' || type === 'integer' || type === 'boolean' || type === 'array' || type === 'object')
        &&
        (value === _const)
    );
};

const ValueValidatorConst = (props) => {
    const {schema, value} = props;
    let {errors, valid} = props;

    let type = schema.get('type');
    let _const = schema.get('const');

    if(typeof _const === 'undefined' || typeof value === 'undefined') return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;

    if(!validateConst(type, schema, value)) {
        valid = false;
        errors = errors.push(List([ERROR_CONST_MISMATCH, Map({const: schema.get('const')})]));
    }

    return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;
};

export {ValueValidatorConst, ValueValidatorEnum, ERROR_CONST_MISMATCH, ERROR_ENUM_MISMATCH, validateConst, validateEnum}
