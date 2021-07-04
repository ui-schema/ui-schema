import {Map} from 'immutable';
import {schemaTypeIsNumeric} from '@ui-schema/ui-schema/Utils/schemaTypeIs';

const ERROR_MULTIPLE_OF = 'multiple-of';

const validateMultipleOf = (schema, value) => {
    const type = schema.get('type');
    let multipleOf = schema.get('multipleOf');
    if(
        schemaTypeIsNumeric(type) && typeof value === 'number' &&
        typeof multipleOf !== 'undefined'
    ) {
        // dealing with JS floating point issues,
        // custom floating point to int/ceil logic
        // according to the precision of the most precise value (either `value` or `multipleOf`)
        let str = (Math.abs(multipleOf) - Math.floor(Math.abs(multipleOf)))
            .toLocaleString('fullwide', {useGrouping: true, maximumSignificantDigits: 9})
        str = typeof str === 'string' ?
            str.replace(/,/g, '.')
            : str
        let strValue = (Math.abs(value) - Math.floor(Math.abs(value)))
            .toLocaleString('fullwide', {useGrouping: true, maximumSignificantDigits: 9})
        strValue = typeof strValue === 'string' ?
            strValue.replace(/,/g, '.')
            : strValue
        const decimalPlacesMultipleOf = str.indexOf('.') !== -1 ? str.substr(str.indexOf('.') + 1).length : 0
        const decimalPlacesValue = strValue.indexOf('.') !== -1 ? strValue.substr(strValue.indexOf('.') + 1).length : 0
        const precisionFactor = decimalPlacesMultipleOf || decimalPlacesValue ?
            Math.pow(10, decimalPlacesMultipleOf > decimalPlacesValue ? decimalPlacesMultipleOf : decimalPlacesValue)
            : 1

        if(
            ((value * precisionFactor).toFixed(0) % (multipleOf * precisionFactor).toFixed(0)) !== 0
        ) {
            return false;
        }
    }

    return true;
};

const multipleOfValidator = {
    handle: ({schema, value, errors, valid}) => {
        if(!validateMultipleOf(schema, value)) {
            valid = false;
            errors = errors.addError(ERROR_MULTIPLE_OF, Map({multipleOf: schema.get('multipleOf')}));
        }

        return {errors, valid}
    },
};

export {multipleOfValidator, ERROR_MULTIPLE_OF, validateMultipleOf}
