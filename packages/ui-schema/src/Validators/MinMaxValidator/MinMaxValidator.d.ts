import { List, OrderedMap } from 'immutable'
import { errors, schema } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_MAX_LENGTH = 'min-length'
export const ERROR_MIN_LENGTH = 'max-length'

export function validateMinMax(schema: OrderedMap<{}, undefined>, value: any): List<any>

export const minMaxValidator: {
    validate: (
        {schema, value, errors, valid}: {
            schema: schema
            value: any
            errors: errors
            valid: boolean
        }
    ) => {
        errors: List<any>
        valid: boolean
    }
}
