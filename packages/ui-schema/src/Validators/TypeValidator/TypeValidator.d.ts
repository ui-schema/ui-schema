import { List } from "immutable"
import { errors, schema } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_WRONG_TYPE = 'wrong-type'

export function validateType(value: any, type: string): boolean

export const typeValidator: {
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
