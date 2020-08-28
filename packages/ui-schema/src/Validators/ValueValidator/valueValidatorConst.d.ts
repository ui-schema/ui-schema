import { errors, schema } from "@ui-schema/ui-schema/CommonTypings"
import { List } from "immutable"

export const ERROR_CONST_MISMATCH = 'const-mismatch'

export function validateConst(type: string, _const?: string | number | boolean, value?: any): boolean

export const valueValidatorConst: {
    should: (
        {schema, value}: {
            schema: schema
            value: any
        }
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
