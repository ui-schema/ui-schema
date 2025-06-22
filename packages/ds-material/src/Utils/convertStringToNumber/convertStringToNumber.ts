import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { schemaTypeIsNumeric } from '@ui-schema/ui-schema/schemaTypeIs'

export type convertStringToNumberType = (value: string | number | any, type: SchemaTypesType) => any | string | number

export const convertStringToNumber: convertStringToNumberType = (value, type) => {
    if (schemaTypeIsNumeric(type)) {
        if (isNaN(value * 1)) {
            console.error('Invalid Type: input not a number in')
            return undefined
        }
        return value === '' ? '' : value * 1
    }
    return value
}
