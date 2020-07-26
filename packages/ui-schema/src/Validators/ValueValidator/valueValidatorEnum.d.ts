import { List } from 'immutable'
import { errors, schema, type } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_ENUM_MISMATCH = 'enum-mismatch'

export function validateEnum<T>(type: type, _enum?: List<any> | T[], value?: any): boolean

// tslint:disable-next-line:no-empty-interface
export interface valueValidatorEnum {
    should: (
        {schema, value}: {
            schema: schema
            value: any
        }
    ) => boolean,
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
