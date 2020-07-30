import { List } from "immutable"
import { errors, schema } from "@ui-schema/ui-schema/CommonTypings"

export type ERROR_NOT_SET = 'required-not-set'

export function checkValueExists(type: string, value: any): boolean

export interface requiredValidator {
    should: (
        {required, ownKey}:
            { required: List<any>, ownKey: string }
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
        required: true
    }
    noValidate: () => { required: false }
}
