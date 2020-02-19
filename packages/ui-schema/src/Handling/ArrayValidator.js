import React from "react";
import {List} from "immutable";
import {NextPluginRenderer} from "../Schema/EditorWidgetStack";
import {validateSchema} from "../Schema/ValidateSchema";

const ERROR_DUPLICATE_ITEMS = 'duplicate-items';
const ERROR_NOT_FOUND_CONTAINS = 'not-found-contains';

let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index);

/**
 * Return false when valid and string for an error
 *
 * @param schema
 * @param value
 * @param find
 * @return {boolean}
 */
const validateArray = (schema, value, find = false) => {
    // setting err results in: a) return false by default when validate, b) return ERROR_NOT_FOUND_CONTAINS by default when find
    // for a: after one fail err will be <string>
    // for b: after one full valid successful found err will be false
    let err = find ? ERROR_NOT_FOUND_CONTAINS : false;
    for(let val of value) {
        err = validateSchema(schema, val);
        if(err && !find) {
            break;
        }
    }

    return err;
};

const ArrayValidator = (props) => {
    const {
        schema, value
    } = props;
    let {errors} = props;

    let {valid} = props;

    let type = schema.get('type');

    if(type === 'array') {
        let uniqueItems = schema.get('uniqueItems');

        if(uniqueItems && value) {
            let duplicates = findDuplicates(value);
            if(Array.isArray(duplicates)) {
                if(duplicates.length) {
                    valid = false;
                    errors = errors.push(ERROR_DUPLICATE_ITEMS);
                }
            } else if(List.isList(duplicates)) {
                if(duplicates.size) {
                    valid = false;
                    errors = errors.push(ERROR_DUPLICATE_ITEMS);
                }
            }
        }

        // todo: sub-schema validations need to be applied to whole sub-schema
        let items = schema.get('items');
        if(items && value) {
            let item_type = items.get('type');
            if(item_type) {
                // single-validation
                let item_err = validateArray(items, value);
                if(List.isList(item_err)) {
                    if(item_err.size) {
                        valid = false;
                        errors = errors.concat(item_err);
                    }
                } else if(item_err) {
                    valid = false;
                    errors = errors.push(item_err);
                }
            } else {
                // tuple validation
                console.error('`items` tuple validation not implemented yet');
            }
        }

        let contains = schema.get('contains');
        if(contains && value) {
            let contains_type = contains.get('type');
            if(contains_type) {
                // single-validation
                let item_err = validateArray(contains, value, true);
                if(List.isList(item_err)) {
                    if(item_err.size) {
                        valid = false;
                        errors = errors.concat(item_err);
                    }
                } else if(item_err) {
                    valid = false;
                    errors = errors.push(item_err);
                }
            } else {
                // tuple validation
                console.error('`contains` tuple validation not implemented yet');
            }
        }
    }

    return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;
};

export {ArrayValidator, ERROR_DUPLICATE_ITEMS, ERROR_NOT_FOUND_CONTAINS}
