import { OrderedMap, List } from 'immutable'
import { errors, schema } from '@ui-schema/ui-schema/CommonTypings'

export type ERROR_MULTIPLE_OF = 'multiple-of'

export function validateMultipleOf(schema: OrderedMap<{}, undefined>, value: any): boolean

export interface multipleOfValidator {
    validate: (
        {schema, value, errors, valid}: {
            schema: schema
            value: any
            errors: errors
            valid: boolean
        }
    ) => {
        errors: List<any>,
        valid: boolean
    }
}
