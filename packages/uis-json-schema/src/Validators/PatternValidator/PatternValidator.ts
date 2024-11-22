import { Map } from 'immutable'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'

export const ERROR_PATTERN = 'pattern-not-matching'

export const validatePattern = (value?: any, pattern?: string): boolean => {
    if (typeof value === 'string' && pattern) {
        return null !== value.match(pattern)
    }

    return true
}

export const patternValidator: SchemaPlugin = {
    handle: ({schema, value, errors, valid}) => {
        if (!schema) return {}
        const pattern = schema.get('pattern')

        if (!validatePattern(value, pattern)) {
            valid = false
            errors = errors.addError(ERROR_PATTERN, Map({pattern, patternError: schema.get('patternError')}))
        }

        return {errors, valid}
    },
}
