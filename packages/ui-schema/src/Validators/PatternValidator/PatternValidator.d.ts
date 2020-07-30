import { List } from "immutable"
import { errors, schema } from "@ui-schema/ui-schema/CommonTypings"

export type ERROR_PATTERN = 'pattern-not-matching'

export function validatePattern(type: string, value?: any, pattern?: string): boolean

export interface patternValidator {
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
