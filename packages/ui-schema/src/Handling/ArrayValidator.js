import {List, Map} from "immutable";
import {validateSchema} from "../Schema/ValidateSchema";
import {ERROR_WRONG_TYPE} from "./TypeValidator";

const ERROR_DUPLICATE_ITEMS = 'duplicate-items';
const ERROR_NOT_FOUND_CONTAINS = 'not-found-contains';
const ERROR_ADDITIONAL_ITEMS = 'additional-items';

let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index);

/**
 * Return false when valid and string for an error
 *
 * @param schemaItems
 * @param value
 * @param additionalItems
 * @param find
 * @return {boolean}
 */
const validateArray = (schemaItems, value, additionalItems, find = false) => {
    // setting err results in: a) return false by default when validate, b) return ERROR_NOT_FOUND_CONTAINS by default when find
    // for a: after one fail err will be <string>
    // for b: after one full valid successful found err will be false
    let err = find ? ERROR_NOT_FOUND_CONTAINS : false;
    for(let val of value) {
        if(List.isList(schemaItems)) {
            // tuple validation
            if(List.isList(val)) {
                // for tuples, the actual item must be an array/list also
                // todo: add values as array support
                // todo: implement tuple validation
                //   actually, only `additionalItems` should be needed to be validated here, the other values should be validated when the input for them is rendered
                //   as "only what is mounted can be entered and validated"
                //   but they must be usable for within conditional schemas
                /*schemaItems.forEach(() => {
                });*/
                if(additionalItems === false && val.size > schemaItems.size) {
                    if(!List.isList(err)) {
                        err = List([err])
                    }
                    // todo: add index of erroneous item; or at all as one context list, only one error instead of multiple?
                    err = err.push(List([ERROR_ADDITIONAL_ITEMS, Map({})]));
                }
            } else {
                if(!List.isList(err)) {
                    err = List([err])
                }
                err = err.push(List([ERROR_WRONG_TYPE, Map({actual: typeof value, arrayTupleValidation: true})]));
            }
        } else {
            // single-validation
            err = validateSchema(schemaItems, val);
            if(err && !find) {
                break;
            }
            if(find && (!err || (List.isList(err) && err.size === 0))) {
                break;
            }
        }
    }

    return err;
};

const validateItems = (schema, value) => {
    let items = schema.get('items');
    if(items && value) {
        let item_err = validateArray(items, value, schema.get('additionalItems'));
        if(List.isList(item_err)) {
            if(item_err.size) {
                return item_err;
            }
        } else if(item_err) {
            return item_err;
        }
    }

    return List([]);
};

const validateContains = (schema, value) => {
    let errors = List();
    if(schema.get('type') !== 'array') return errors;

    const contains = schema.get('contains');
    let contains_type = contains.get('type');
    if(!contains_type) return errors;

    let item_err = validateArray(contains, value, undefined, true);
    if(List.isList(item_err)) {
        if(item_err.size) {
            errors = errors.concat(item_err);
        }
    } else if(item_err) {
        errors = errors.push(item_err);
    }

    return errors;
};

const arrayValidator = {
    should: ({schema}) => {
        let type = schema.get('type');

        return type === 'array'
    },
    validate: ({schema, value, errors, valid}) => {
        // unique-items sub-schema is intended for dynamics and for statics, e.g. Selects could have duplicates but also a SimpleList of strings
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

export {arrayValidator, ERROR_DUPLICATE_ITEMS, ERROR_NOT_FOUND_CONTAINS, validateItems, validateContains}
