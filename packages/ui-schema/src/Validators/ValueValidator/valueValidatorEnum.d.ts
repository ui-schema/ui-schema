import { List } from 'immutable'
import { ValidatorPlugin } from "@ui-schema/ui-schema/ValidatorStack/ValidatorPlugin"
import { PluginProps } from "@ui-schema/ui-schema/PluginStack/Plugin"
import { Errors } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_ENUM_MISMATCH = 'enum-mismatch'

export function validateEnum<T>(type: string, _enum?: List<any> | T[], value?: any): boolean

export interface ValueValidatorEnumType extends ValidatorPlugin {
    should: ({schema, value}: Partial<PluginProps>) => boolean
    validate: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: Errors
        valid: boolean
    }
}

export const valueValidatorEnum: ValueValidatorEnumType
