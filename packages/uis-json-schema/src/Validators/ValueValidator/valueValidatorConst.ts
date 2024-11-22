import { isEqual } from '@ui-schema/system/Utils/isEqual'
import { fromJS, List, Map, Record } from 'immutable'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'

export const ERROR_CONST_MISMATCH = 'const-mismatch'

export const validateConst = (_const?: string | number | boolean | null, value?: any): boolean => {
    if (typeof _const === 'undefined' || typeof value === 'undefined') return true
    let tValue = value
    if (Array.isArray(value)) {
        tValue = List(fromJS(value))
    } else if (
        typeof value === 'object' && value !== null &&
        !List.isList(value) && !Map.isMap(value) && !Record.isRecord(value)
    ) {
        tValue = Map(fromJS(value))
    }
    return isEqual(tValue, _const)
}

export const valueValidatorConst: SchemaPlugin = {
    should: ({schema, value}) => {
        const _const = schema?.get('const')

        return typeof _const !== 'undefined' && typeof value !== 'undefined'
    },
    handle: ({schema, value, errors, valid}) => {
        if (!schema) return {}
        if (!validateConst(schema.get('const'), value)) {
            valid = false
            errors = errors.addError(ERROR_CONST_MISMATCH, Map({const: schema.get('const')}))
        }

        return {errors, valid}
    },
}
