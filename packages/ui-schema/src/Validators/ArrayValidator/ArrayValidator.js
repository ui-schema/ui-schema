import {List, Map} from "immutable";
import {validateSchema} from "../../validateSchema/index";
import {ERROR_WRONG_TYPE} from "@ui-schema/ui-schema/Validators/TypeValidator/TypeValidator";

export const ERROR_DUPLICATE_ITEMS = 'duplicate-items';
export const ERROR_NOT_FOUND_CONTAINS = 'not-found-contains';
export const ERROR_ADDITIONAL_ITEMS = 'additional-items';

let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index);

/**
 * This function
 * Return false when valid and string for an error
 *
 * @param schema single schema or tuple schema
 * @param value
 * @param additionalItems
 * @param find
 * @return {boolean|List}
 */
export const validateArrayContent = (schema, value, additionalItems = true, find = false) => {
    let err = List([]);
    for(let val of value) {
        let tmpErr = List([]);
        if(List.isList(schema)) {
            // tuple validation
            if(List.isList(val) || Array.isArray(val)) {
                // for tuples, the actual item must be an array/list also
                /*if(typeof schema.get(i) !== 'undefined') {
                    let tmpErr2 = validateSchema(schema.get(i), val);
                    if(tmpErr2) {
                        // todo: support errors as list
                        tmpErr = tmpErr.push(tmpErr2)
                    }
                } else {
                    if(!validateAdditionalItems(additionalItems, val, schema)) {
                        // todo: add index of erroneous item; or at all as one context list, only one error instead of multiple?
                        tmpErr = tmpErr.push(List([ERROR_ADDITIONAL_ITEMS, Map({})]));
                    }
                }*/
                // todo: add values as array support
                // todo: implement tuple validation
                //   actually, only `additionalItems` should be needed to be validated here, the other values should be validated when the input for them is rendered
                //   as "only what is mounted can be entered and validated"
                //   but they must be usable for within conditional schemas
                if(!validateAdditionalItems(additionalItems, val, schema)) {
                    // todo: add index of erroneous item; or at all as one context list, only one error instead of multiple?
                    tmpErr = tmpErr.push(List([ERROR_ADDITIONAL_ITEMS, Map({})]));
                }
            } else {
                // when tuple schema but no-tuple value
                tmpErr = tmpErr.push(List([ERROR_WRONG_TYPE, Map({actual: typeof value, arrayTupleValidation: true})]));
            }
        } else {
            // single-validation
            // Cite from json-schema.org: When items is a single schema, the additionalItems keyword is meaningless, and it should not be used.
            let tmpErr2 = validateSchema(schema, val);
            if(tmpErr2) {
                // todo: support errors as list
                tmpErr = tmpErr.push(tmpErr2)
            }
        }
        if(find && tmpErr.size === 0) {
            err = tmpErr;
            break;
        }
        err = err.concat(tmpErr);
    }

    return err;
};

export const validateAdditionalItems = (additionalItems, value, schema) => {
    return additionalItems === true || (
        additionalItems === false && (
            (List.isList(value) && value.size <= schema.size) ||
            (Array.isArray(value) && value.length <= schema.size)
        )
    )
}

export const validateItems = (schema, value) => {
    let items = schema.get('items');
    if(items && value) {
        let item_err = validateArrayContent(items, value, schema.get('additionalItems'));
        if(List.isList(item_err)) {
            if(item_err.size) {
                return item_err;
            }
        } else if(item_err) {
            return List([item_err]);
        }
    }

    return List([]);
};

export const validateContains = (schema, value) => {
    let errors = List([]);
    if(schema.get('type') !== 'array') return errors;

    const contains = schema.get('contains');
    if(!contains) return errors;
    let contains_type = contains.get('type');
    if(!contains_type) return errors;

    let item_err = validateArrayContent(contains, value, undefined, true);

    if(List.isList(item_err)) {
        if(item_err.size) {
            errors = errors.concat(item_err);
        }
    } else if(item_err) {
        errors = errors.push(item_err);
    }

    if((Array.isArray(value) && value.length === 0) || (List.isList(value) && value.size === 0)) {
        errors = errors.push(ERROR_NOT_FOUND_CONTAINS);
    }

    return errors;
};

export const validateUniqueItems = (schema, value) => {
    let uniqueItems = schema.get('uniqueItems');
    if(uniqueItems && value) {
        let duplicates = findDuplicates(value);
        if(Array.isArray(duplicates)) {
            return duplicates.length === 0;
        } else if(List.isList(duplicates)) {
            return duplicates.size === 0;
        }
    }
    return true;
}

export const arrayValidator = {
    should: ({schema}) => {
        let type = schema.get('type');

        return type === 'array'
    },
    validate: ({schema, value, errors, valid}) => {
        // unique-items sub-schema is intended for dynamics and for statics, e.g. Selects could have duplicates but also a SimpleList of strings
        let uniqueItems = schema.get('uniqueItems');
        if(uniqueItems && value) {
            if(!validateUniqueItems(schema, value)) {
                valid = false;
                errors = errors.push(ERROR_DUPLICATE_ITEMS);
            }
        }

        /*
         * `items` sub-schema validation is intended for dynamic-inputs like SimpleList or GenericList
         * - thus the validity must also be checked in the components rendering the sub-schema,
         * - when validation is done here, the parent receives the invalidations instead of the actual component that is invalid
         * - e.g. 2 out of 3 are invalid, only one error is visible on the parent-component
         * - but when the items are not valid, the parent should also know that something is invalid
         * - providing context `arrayItems = true` for errors makes it possible to distinct the errors in the parent-component
         * - full sub-schema validation is done (and possible) if the sub-schema is rendered through e.g. NestedSchemaEditor
         */
        let items = schema.get('items');
        if(items && value) {
            let items_err = validateItems(schema, value);
            if(items_err.size) {
                valid = false;
                errors = errors.concat(items_err.map(err =>
                    // updating error context with `items` to be able to distinct between
                    List.isList(err) ?
                        err.setIn([1, 'arrayItems'], true) :
                        List([err, Map({arrayItems: true})])
                ));
            }
        }

        // `contains` sub-schema is intended for components which may be dynamic, but the error is intended to be shown on the root-component and not the sub-schema, as not clear which-sub-schema it is, "1 out of n sub-schemas must be valid" can not logically translated to "specific sub-schema X is invalid"
        // todo: the error displayed on the the array component may be confusing, it should be possible to distinct between "own-errors" and child-errors
        //    maybe adding a possibility to update the validity for sub-schemas from the parent-component?
        let contains = schema.get('contains');
        if(contains && value) {
            const containsError = validateContains(schema, value);
            if(containsError.size) {
                valid = false;
                errors = errors.concat(containsError);
            }
        }
        return {errors, valid}
    }
};
