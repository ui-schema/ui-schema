import {validateType} from '../Validators/TypeValidator/TypeValidator';
import {ERROR_WRONG_TYPE} from '../Validators/TypeValidator/TypeValidator';
import {ERROR_PATTERN, validatePattern} from '../Validators/PatternValidator/PatternValidator';
import {validateMinMax} from '../Validators/MinMaxValidator/MinMaxValidator';
import {ERROR_CONST_MISMATCH, ERROR_ENUM_MISMATCH, validateConst, validateEnum} from '../Validators/ValueValidator';
import {ERROR_MULTIPLE_OF, validateMultipleOf} from '../Validators/MultipleOfValidator/MultipleOfValidator';
import {validateContains} from '../Validators/ArrayValidator/ArrayValidator';
import {ERROR_NOT_SET} from '../Validators/RequiredValidator/RequiredValidator';
import {validateObject} from '../Validators/ObjectValidator/ObjectValidator';
import {createValidatorErrors} from '@ui-schema/ui-schema/ValidatorErrors/ValidatorErrors';
import {validateOneOf} from '@ui-schema/ui-schema/Validators/OneOfValidator';

/**
 * Return false when valid and string/List for an error
 *
 * @param schema
 * @param value
 * @return {ValidatorErrorsType}
 */
export const validateSchema = (schema, value) => {
    let type = schema.get('type');
    let pattern = schema.get('pattern');

    let err = createValidatorErrors();
    let not = schema.get('not');
    if(not) {
        // supporting `not` for any validations
        // https://json-schema.org/understanding-json-schema/reference/combining.html#not
        let tmpNot = validateSchema(not, value);
        return tmpNot.hasError() ? tmpNot.addError('not-is-valid') : err;
    }

    if(!validateType(value, type)) {
        err = err.addError(ERROR_WRONG_TYPE);
    } else if(!validatePattern(type, value, pattern)) {
        err = err.addError(ERROR_PATTERN);
    } else if(!validateConst(schema.get('const'), value)) {
        err = err.addError(ERROR_CONST_MISMATCH);
    } else if(!validateEnum(schema.get('enum'), value)) {
        err = err.addError(ERROR_ENUM_MISMATCH);
    } else if(!validateMultipleOf(schema, value)) {
        err = err.addError(ERROR_MULTIPLE_OF);
    } else {
        const errMinMax = validateMinMax(schema, value);
        if(errMinMax.hasError()) {
            return errMinMax;
        }
        const errObj = validateObject(schema, value);
        if(errObj.hasError()) {
            return errObj;
        }
        const errContains = validateContains(schema, value);
        if(errContains.hasError()) {
            return errContains;
        }
        const errOneOf = validateOneOf(schema.get('oneOf'), value)
        if(errOneOf.errors.hasError()) {
            return errOneOf.errors;
        }
    }

    return err;
};

/**
 * Validating the value, property for property.
 *
 * @param {Map} schema
 * @param {Map|Record} value
 * @return {List<*>}
 */
export const validateSchemaObject = (schema, value) => {
    let err = createValidatorErrors();
    let properties = schema.get('properties');
    if(!properties) return err;

    properties.forEach((subSchema, key) => {
        let val = value.get(key);
        if(typeof val === 'undefined') {
            err = err.addError(ERROR_NOT_SET);
            return;
        }

        let t = validateSchema(subSchema, val);
        if(t.hasError()) {
            err = err.addErrors(t);
        }
    });

    return err;
};
