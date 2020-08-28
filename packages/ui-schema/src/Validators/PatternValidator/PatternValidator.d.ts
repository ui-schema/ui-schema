import { List } from "immutable"
import { errors, schema } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_PATTERN = 'pattern-not-matching'

export function validatePattern(type: string, value?: any, pattern?: string): boolean

export const patternValidator: {
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
