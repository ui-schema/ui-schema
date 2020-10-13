import { ValidatorPlugin } from "@ui-schema/ui-schema/ValidatorStack/ValidatorPlugin"
import { PluginProps } from "@ui-schema/ui-schema/PluginStack/Plugin"
import { Errors } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_WRONG_TYPE = 'wrong-type'

export function validateType(value: any, type: string): boolean

export interface TypeValidatorType extends ValidatorPlugin {
    validate: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: Errors
        valid: boolean
    }
}

export const typeValidator: TypeValidatorType
