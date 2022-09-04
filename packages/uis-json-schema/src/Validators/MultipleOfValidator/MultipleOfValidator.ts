import { Map } from 'immutable'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'

export const ERROR_MULTIPLE_OF = 'multiple-of'

export const validateMultipleOf = (schema: UISchemaMap, value: any): boolean => {
    const multipleOf = schema.get('multipleOf')
    if (typeof value === 'number' && typeof multipleOf === 'number') {
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
        const decimalPlacesMultipleOf = str.indexOf('.') !== -1 ? str.slice(str.indexOf('.') + 1).length : 0
        const decimalPlacesValue = strValue.indexOf('.') !== -1 ? strValue.slice(strValue.indexOf('.') + 1).length : 0
        const precisionFactor = decimalPlacesMultipleOf || decimalPlacesValue ?
            Math.pow(10, decimalPlacesMultipleOf > decimalPlacesValue ? decimalPlacesMultipleOf : decimalPlacesValue)
            : 1

        if (
            (Number(((value * precisionFactor).toFixed(0))) % Number((multipleOf * precisionFactor).toFixed(0))) !== 0
        ) {
            return false
        }
    }

    return true
}

export const multipleOfValidator: SchemaPlugin = {
    handle: ({schema, value, errors, valid}) => {
        if (!validateMultipleOf(schema, value)) {
            valid = false
            errors = errors.addError(ERROR_MULTIPLE_OF, Map({multipleOf: schema.get('multipleOf')}))
        }

        return {errors, valid}
    },
}
