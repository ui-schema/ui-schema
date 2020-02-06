import React from "react";
import {List} from "immutable";
import {Map} from "immutable";
import {NextPluginRenderer} from "../Schema/EditorWidgetStack";
import {validateNamePattern, ERROR_PATTERN} from "./PatternValidator";
import {validateSchema} from "../Schema/ValidateSchema";

const ERROR_ADDITIONAL_PROP = 'additional-property';

const validateObject = (schema, value, find = false) => {
    // setting err results in: a) return false by default when validate, b) return ERROR_NOT_FOUND_CONTAINS by default when find
    // for a: after one fail err will be <string>
    // for b: after one full valid successful found err will be false
    let err = find ? (ERROR_PATTERN || ERROR_ADDITIONAL_PROP) : false;
    for(let val of value) {
        err = validateSchema(schema, val);
        if(err && !find) {
            break;
        }
    }
    return err;
};


const ObjectValidator = (props) => {
    const {
        schema, value
    } = props;
    let {errors} = props;

    let {valid} = props;

    let type = schema.get('type');

    if(type === 'object') {
        let patternProperties = schema.get('patternProperties');
        let additionalProperties = schema.get('additionalProperties');
        let properties = schema.get('properties');

        if(properties && patternProperties) {
            schema.getIn(['properties']).map((value, key) => {
                if(!validateNamePattern(key, patternProperties)) {
                    errors = errors.push(ERROR_PATTERN);
                }
            });
            if(additionalProperties) {
                if(List.isList(value) && value.size !== schema.getIn(['properties']).keySeq().size
                    || Map.isMap(value) && value.size !== schema.getIn(['properties']).keySeq().size
                    || Array.isArray(value) && value.length !== schema.getIn(['properties']).keySeq().size) {
                    errors = errors.push(ERROR_ADDITIONAL_PROP);
                }
            }
        }
    }

    return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;
};

export {ObjectValidator, validateObject, ERROR_ADDITIONAL_PROP};
