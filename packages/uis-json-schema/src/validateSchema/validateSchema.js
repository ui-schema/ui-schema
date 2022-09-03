import {validateType} from '../Validators/TypeValidator';
import {ERROR_WRONG_TYPE} from '../Validators/TypeValidator';
import {ERROR_PATTERN, validatePattern} from '../Validators/PatternValidator';
import {validateMinMax} from '../Validators/MinMaxValidator';
import {ERROR_CONST_MISMATCH, ERROR_ENUM_MISMATCH, validateConst, validateEnum} from '../Validators/ValueValidator';
import {ERROR_MULTIPLE_OF, validateMultipleOf} from '../Validators/MultipleOfValidator';
import {validateContains} from '../Validators/ArrayValidator';
import {validateObject} from '../Validators/ObjectValidator';
import {validateOneOf} from '../Validators/OneOfValidator';
import {createValidatorErrors} from '@ui-schema/system/ValidatorErrors';

/**
 * Return false when valid and string/List for an error
 *
 * @param schema
 * @param value
 * @param recursively
 * @return {ValidatorErrorsType}
 */
export const validateSchema = (schema, value, recursively = false) => {
    let type = schema.get('type');
    let pattern = schema.get('pattern');

    let err = createValidatorErrors();
    let not = schema.get('not');
    if(not) {
        // supporting `not` for any validations
        // https://json-schema.org/understanding-json-schema/reference/combining.html#not
        let tmpNot = validateSchema(not, value, recursively);
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
        const errObj = validateObject(schema, value, recursively);
        if(errObj.hasError()) {
            return errObj;
        }
        const errContains = validateContains(schema, value);
        if(errContains.hasError()) {
            return errContains;
        }
        const errOneOf = validateOneOf(schema.get('oneOf'), value, recursively)
        if(errOneOf.errors.hasError()) {
            return errOneOf.errors;
        }
    }

    return err;
};
