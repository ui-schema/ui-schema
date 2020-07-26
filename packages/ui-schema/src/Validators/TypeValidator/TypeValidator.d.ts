import { validatorPlugin } from '../../Validators/validate'
import { List } from "immutable"
import { errors, schema } from "@ui-schema/ui-schema/CommonTypings"

export type ERROR_WRONG_TYPE = string

export function validateType(type: string, value: any): boolean

// tslint:disable-next-line:no-empty-interface
export interface typeValidator  {
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
