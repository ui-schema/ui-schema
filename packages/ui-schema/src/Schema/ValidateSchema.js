import {List} from 'immutable';
import {validateType} from "../Handling/TypeValidator";
import {ERROR_WRONG_TYPE} from "../Handling/TypeValidator";
import {ERROR_PATTERN, validatePattern} from "../Handling/PatternValidator";
import {validateMinMax} from "../Handling/MinMaxValidator";
import {ERROR_CONST_MISMATCH, ERROR_ENUM_MISMATCH, validateConst, validateEnum} from "../Handling/ValueValidator";
import {ERROR_MULTIPLE_OF, validateMultipleOf} from "../Handling/MultipleOfValidator";
import {ERROR_NOT_SET, validateContains} from "..";

/**
 * Return false when valid and string/List for an error
 *
 * @param schema
 * @param value
 * @return {boolean|string|List}
 */
const validateSchema = (schema, value) => {
    let type = schema.get('type');
    let pattern = schema.get('pattern');

    let not = schema.get('not');
    if(not) {
        // supporting `not` for any validations
        // https://json-schema.org/understanding-json-schema/reference/combining.html#not
        let tmpNot = validateSchema(not, value);
        return (0 === tmpNot.size || false === tmpNot) ? 'not-is-valid' : false;
    }

    let err = false;

    if(!validateType(value, type)) {
        err = ERROR_WRONG_TYPE;
    } else if(!validatePattern(type, value, pattern)) {
        err = ERROR_PATTERN;
    } else if(validateMinMax(type, schema, value, false).size) {
        // todo: duplicate validate checks when invalid [performance]
        err = validateMinMax(type, schema, value, false);
    } else if(!validateConst(type, schema, value)) {
        err = ERROR_CONST_MISMATCH;
    } else if(!validateEnum(type, schema, value)) {
        err = ERROR_ENUM_MISMATCH;
    } else if(!validateMultipleOf(type, schema, value)) {
        err = ERROR_MULTIPLE_OF;
    } else if(validateContains(schema, value).size) {
        // todo: duplicate validate checks when invalid [performance]
        err = validateContains(schema, value);
    }

    return err;
};

/**
 * Validating the value, property for property.
 *
 * @todo: add required support, currently treating everything as required (needed for if/else/then logic)
 * @todo: add `object-validator` at last position
 * @param {Map} schema
 * @param {Map} value
 * @return {List<*>}
 */
const validateSchemaObject = (schema, value) => {
    let err = List([]);
    let properties = schema.get('properties');
    if(!properties) return err;

    properties.forEach((subSchema, key) => {
        let val = value.get(key);
        if(typeof val === 'undefined') {
            err = err.push(ERROR_NOT_SET);
            return;
        }

        let t = validateSchema(subSchema, val);
        if(t) {
            err = err.push(t);
        }
    });

    return err;
};

export {validateSchema, validateSchemaObject}
