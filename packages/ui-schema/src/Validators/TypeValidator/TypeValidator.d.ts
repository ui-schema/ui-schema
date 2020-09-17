import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { PluginProps } from "@ui-schema/ui-schema/PluginStack/Plugin"
import { errors } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_WRONG_TYPE = 'wrong-type'

export function validateType(value: any, type: string): boolean

export interface TypeValidatorType extends ValidatorPlugin {
    validate: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: errors
        valid: boolean
    }
}

export const typeValidator: TypeValidatorType
