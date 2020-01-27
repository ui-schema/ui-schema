import {validateType} from "../Handling/TypeValidator";
import {ERROR_WRONG_TYPE} from "../Handling/TypeValidator";
import {ERROR_PATTERN, validatePattern} from "../Handling/PatternValidator";
import {validateMinMax} from "../Handling/MinMaxValidator";
import {ERROR_CONST_MISMATCH, ERROR_ENUM_MISMATCH, validateConst, validateEnum} from "../Handling/ValueValidator";
import {ERROR_MULTIPLE_OF, validateMultipleOf} from "../Handling/MultipleOfValidator";

/**
 * Return false when valid and string for an error
 *
 * @param schema
 * @param value
 * @return {boolean|List}
 */
const validateSchema = (schema, value) => {
    let type = schema.get('type');
    let pattern = schema.get('pattern');

    let err = false;

    if(!validateType(value, type)) {
        err = ERROR_WRONG_TYPE;
    } else if(!validatePattern(type, value, pattern)) {
        err = ERROR_PATTERN;
    } else if(validateMinMax(type, schema, value, true).size) {
        // todo: duplicate validate checks when invalid [performance]
        err = validateMinMax(type, schema, value, true);
    } else if(!validateConst(type, schema, value)) {
        err = ERROR_CONST_MISMATCH;
    } else if(!validateEnum(type, schema, value)) {
        err = ERROR_ENUM_MISMATCH;
    } else if(!validateMultipleOf(type, schema, value)) {
        err = ERROR_MULTIPLE_OF;
    }

    return err;
};

export {validateSchema}
