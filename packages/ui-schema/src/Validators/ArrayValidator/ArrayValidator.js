import {List, Map} from 'immutable';
import {validateSchema} from '@ui-schema/ui-schema/validateSchema';
import {createValidatorErrors} from '@ui-schema/ui-schema/ValidatorErrors';
import {ERROR_WRONG_TYPE} from '@ui-schema/ui-schema/Validators/TypeValidator/TypeValidator';

export const ERROR_DUPLICATE_ITEMS = 'duplicate-items';
export const ERROR_NOT_FOUND_CONTAINS = 'not-found-contains';
export const ERROR_MIN_CONTAINS = 'min-contains';
export const ERROR_MAX_CONTAINS = 'max-contains';
export const ERROR_ADDITIONAL_ITEMS = 'additional-items';

let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index);

/**
 * @param itemsSchema single schema or tuple schema
 * @param value
 * @param additionalItems
 * @return {{err: ValidatorErrorsType, found: number}}
 */
export const validateArrayContent = (itemsSchema, value, additionalItems = true) => {
    let err = createValidatorErrors();
    let found = 0;
    if(
        (List.isList(itemsSchema) || Array.isArray(itemsSchema))
    ) {
        // tuple validation
        if(List.isList(value) || Array.isArray(value)) {
            // for tuples, the actual item must be an array/list also
            // todo: add values as array support
            // todo: implement tuple validation
            //   actually, only `additionalItems` should be needed to be validated here, the other values should be validated when the input for them is rendered
            //   as "only what is mounted can be entered and validated"
            //   but they must be usable for within conditional schemas
            if(!validateAdditionalItems(additionalItems, value, itemsSchema)) {
                // todo: add index of erroneous item; or at all as one context list, only one error instead of multiple?
                err = err.addError(ERROR_ADDITIONAL_ITEMS, Map({}));
                found++
            }
            /* example: further nested validation
            const listSize = itemsSchema.size || 0
            value.forEach((val, i) => {
                if(i < listSize) {
                    let tmpErr = validateSchema(itemsSchema.get(i), val);
                    if(tmpErr.hasError()) {
                        err = err.addErrors(tmpErr)
                        found++
                    }
                }
            })*/
        } else {
            //console.log('val?.toJS()', /*val,*/ schema?.toJS(), value?.toJS())
            // when tuple schema but no-tuple value
            err = err.addError(ERROR_WRONG_TYPE, Map({actual: typeof value, arrayTupleValidation: true}));
            found++
        }
    }/* else if(
        itemsSchema.get('type') === 'array' &&
        (List.isList(nestedItemsSchema) || Array.isArray(nestedItemsSchema))
    ) {
        // nested tuple validation
        console.log('nested tuple validation', itemsSchema?.toJS())
    } else if(
        itemsSchema.get('type') === 'array' &&
        (Map.isMap(nestedItemsSchema) || typeof nestedItemsSchema === 'object')
    ) {
        // a nested "one-schema-for-all" array, nested in the current array
        console.log('nested one-schema-for-all', itemsSchema?.toJS())
    }*/ else if(itemsSchema.get('type') !== 'array') {
        // no nested array, one-schema for all items
        // not validating array content of array here, must be validated with next schema level
        for(let val of value) {
            let tmpErr = createValidatorErrors();
            // single-validation
            // Cite from json-schema.org: When items is a single schema, the additionalItems keyword is meaningless, and it should not be used.
            let tmpErr2 = validateSchema(itemsSchema, val);
            if(tmpErr2.hasError()) {
                tmpErr = tmpErr.addErrors(tmpErr2)
            }
            if(tmpErr.errCount === 0) {
                found++
            } else {
                err = err.addErrors(tmpErr);
            }
        }
    }

    return {
        err,
        found,
    };
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
        return item_err.err
    }

    return createValidatorErrors();
};

export const validateContains = (schema, value) => {
    let errors = createValidatorErrors();
    if(schema.get('type') !== 'array') return errors;

    const contains = schema.get('contains');
    if(!contains) return errors;
    let contains_type = contains.get('type');
    if(!contains_type) return errors;

    let minContains = schema.get('minContains');
    let maxContains = schema.get('maxContains');

    let item_err = validateArrayContent(contains, value, undefined);

    if(
        (item_err.found < 1 && typeof minContains === 'undefined' && typeof maxContains === 'undefined') ||
        (typeof minContains === 'number' && minContains > item_err.found) ||
        (typeof maxContains === 'number' && maxContains < item_err.found)
    ) {
        if(item_err.err.errCount !== 0) {
            errors = errors.addErrors(item_err.err);
        }
    }

    if(typeof minContains === 'number' && minContains > item_err.found) {
        errors = errors.addError(ERROR_MIN_CONTAINS, Map({minContains}));
    }
    if(typeof maxContains === 'number' && maxContains < item_err.found) {
        errors = errors.addError(ERROR_MAX_CONTAINS, Map({maxContains}));
    }

    if(
        minContains !== 0 &&
        ((Array.isArray(value) && value.length === 0) || (List.isList(value) && value.size === 0))
    ) {
        errors = errors.addError(ERROR_NOT_FOUND_CONTAINS);
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
    handle: ({schema, value, errors, valid}) => {
        // unique-items sub-schema is intended for dynamics and for statics, e.g. Selects could have duplicates but also a SimpleList of strings
        let uniqueItems = schema.get('uniqueItems');
        if(uniqueItems && value) {
            if(!validateUniqueItems(schema, value)) {
                valid = false;
                errors = errors.addError(ERROR_DUPLICATE_ITEMS);
            }
        }

        /*
         * `items` sub-schema validation is intended for dynamic-inputs like SimpleList or GenericList
         * - thus the validity must also be checked in the components rendering the sub-schema,
         * - when validation is done here, the parent receives the invalidations instead of the actual component that is invalid
         * - e.g. 2 out of 3 are invalid, only one error is visible on the parent-component
         * - but when the items are not valid, the parent should also know that something is invalid
         * - providing context `arrayItems = true` for errors makes it possible to distinct the errors in the parent-component
         * - full sub-schema validation is done (and possible) if the sub-schema is rendered through e.g. PluginStack isVirtual
         */
        let items = schema.get('items');
        if(items && value) {
            let items_err = validateItems(schema, value);
            if(items_err.hasError()) {
                valid = false;
                //errors = errors.addChildErrors(items_err);
                errors = errors.addErrorsToChild(items_err);
            }
        }

        // `contains` sub-schema is intended for components which may be dynamic, but the error is intended to be shown on the root-component and not the sub-schema, as not clear which-sub-schema it is, "1 out of n sub-schemas must be valid" can not logically translated to "specific sub-schema X is invalid"
        // todo: the error displayed on the the array component may be confusing, it should be possible to distinct between "own-errors" and child-errors
        //    maybe adding a possibility to update the validity for sub-schemas from the parent-component?
        let contains = schema.get('contains');
        if(contains && value) {
            const containsError = validateContains(schema, value);
            if(containsError.hasError()) {
                valid = false;
                errors = errors.addErrors(containsError);
            }
        }
        return {errors, valid}
    },
};
