import { List } from 'immutable'
import { PluginProps } from "@ui-schema/ui-schema/PluginStack/Plugin"
import { Errors } from '@ui-schema/ui-schema/CommonTypings'
import { PluginSimple } from '@ui-schema/ui-schema/PluginSimpleStack/PluginSimple'

export const ERROR_ENUM_MISMATCH = 'enum-mismatch'

export function validateEnum<T>(_enum?: List<T> | T[], value?: any): boolean

export interface ValueValidatorEnumType extends PluginSimple {
    should: ({schema, value}: Partial<PluginProps>) => boolean
    handle: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: Errors
        valid: boolean
    }
}

export const valueValidatorEnum: ValueValidatorEnumType
