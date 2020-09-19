import { PluginProps } from "@ui-schema/ui-schema/PluginStack/Plugin"
import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { Errors } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_CONST_MISMATCH = 'const-mismatch'

export function validateConst(type: string, _const?: string | number | boolean, value?: any): boolean

export interface ValueValidatorConstType extends ValidatorPlugin {
    should: ({schema, value}: Partial<PluginProps>) => boolean
    validate: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: Errors
        valid: boolean
    }
}

export const valueValidatorConst: ValueValidatorConstType
