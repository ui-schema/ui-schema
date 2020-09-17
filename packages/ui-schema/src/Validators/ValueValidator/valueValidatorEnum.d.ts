import { List } from 'immutable'
import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { PluginProps } from "@ui-schema/ui-schema/PluginStack/Plugin"
import { errors } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_ENUM_MISMATCH = 'enum-mismatch'

export function validateEnum<T>(type: string, _enum?: List<any> | T[], value?: any): boolean

export interface ValueValidatorEnumType extends ValidatorPlugin {
    should: ({schema, value}: Partial<PluginProps>) => boolean
    validate: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: errors
        valid: boolean
    }
}

export const valueValidatorEnum: ValueValidatorEnumType
