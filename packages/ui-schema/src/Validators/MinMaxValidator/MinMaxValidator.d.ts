import { List, OrderedMap } from 'immutable'
import { errors, schema } from "@ui-schema/ui-schema/CommonTypings"

export type ERROR_MAX_LENGTH = 'min-length'
export type ERROR_MIN_LENGTH = 'max-length'

export function validateMinMax(schema: OrderedMap<{}, undefined>, value: any, strict: boolean): List<any>

export interface minMaxValidator {
    validate: (
        {required, schema, value, errors, valid}: {
            required: boolean
            schema: schema
            value: any
            errors: errors
            valid: boolean
        }
    ) => {
        errors: List<any>,
        valid: boolean
    },
}
