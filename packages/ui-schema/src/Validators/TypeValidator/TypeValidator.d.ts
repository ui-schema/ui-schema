import { PluginSimple } from "@ui-schema/ui-schema/PluginSimpleStack/PluginSimple"
import { PluginProps } from "@ui-schema/ui-schema/PluginStack/Plugin"
import { Errors, SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'

export const ERROR_WRONG_TYPE = 'wrong-type'

export function validateType(value: any, type: SchemaTypesType): boolean

export interface TypeValidatorType extends PluginSimple {
    handle: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: Errors
        valid: boolean
    }
}

export const typeValidator: TypeValidatorType
