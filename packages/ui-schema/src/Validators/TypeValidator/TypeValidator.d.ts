import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { EditorPluginProps } from "@ui-schema/ui-schema/EditorPlugin"
import { errors } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_WRONG_TYPE = 'wrong-type'

export function validateType(value: any, type: string): boolean

export interface TypeValidatorType extends ValidatorPlugin {
    validate: (
        {schema, value, errors, valid}: Partial<EditorPluginProps>
    ) => {
        errors: errors
        valid: boolean
    }
}

export const typeValidator: TypeValidatorType
