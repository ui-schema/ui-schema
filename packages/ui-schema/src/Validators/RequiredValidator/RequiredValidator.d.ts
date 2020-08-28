import { List } from "immutable"
import { errors, schema } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_NOT_SET = 'required-not-set'

/**
 *
 * @param type
 * @param value
 *
 * @return boolean false when value does not exist per definition for this type, it still may be empty another way
 */
export function checkValueExists(type: string, value: any): boolean

export const requiredValidator: {
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
