import {List, Map} from "immutable";

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

const valueValidatorEnum = {
    should: ({schema, value}) => {
        /**
         * @var {[]|List} _enum
         */
        let _enum = schema.get('enum');

        return typeof _enum !== 'undefined' && typeof value !== 'undefined'
    },
    validate: ({schema, value, errors, valid}) => {
        let type = schema.get('type');

        if(!validateEnum(type, schema, value)) {
            valid = false;
            errors = errors.push(ERROR_ENUM_MISMATCH);
        }

        return {errors, valid}
    }
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

const valueValidatorConst = {
    should: ({schema, value}) => {
        let _const = schema.get('const');

        return typeof _const !== 'undefined' && typeof value !== 'undefined'
    },
    validate: ({schema, value, errors, valid}) => {
        let type = schema.get('type');

        if(!validateConst(type, schema, value)) {
            valid = false;
            errors = errors.push(List([ERROR_CONST_MISMATCH, Map({const: schema.get('const')})]));
        }

        return {errors, valid}
    }
};

export {valueValidatorConst, valueValidatorEnum, ERROR_CONST_MISMATCH, ERROR_ENUM_MISMATCH, validateConst, validateEnum}
