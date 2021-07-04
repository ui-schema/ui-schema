import { PluginProps } from '@ui-schema/ui-schema/PluginStack/Plugin'
import { PluginSimple } from '@ui-schema/ui-schema/PluginSimpleStack/PluginSimple'
import { Errors, SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'

export const ERROR_CONST_MISMATCH = 'const-mismatch'

export function validateConst(type: SchemaTypesType, _const?: string | number | boolean | null, value?: any): boolean

export interface ValueValidatorConstType extends PluginSimple {
    should: ({schema, value}: Partial<PluginProps>) => boolean
    handle: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: Errors
        valid: boolean
    }
}

export const valueValidatorConst: ValueValidatorConstType
