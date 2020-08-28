import { List } from 'immutable'
import { errors, schema } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_ADDITIONAL_PROPERTIES = 'additional-properties'

export function validateObject(schema: schema, value: any): List<any>

export const objectValidator: {
    should: (
        {schema}: { schema: schema }
    ) => boolean
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
