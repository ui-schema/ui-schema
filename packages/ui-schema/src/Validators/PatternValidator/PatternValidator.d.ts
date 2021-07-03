import { PluginSimple } from "@ui-schema/ui-schema/PluginSimpleStack/PluginSimple"
import { PluginProps } from "@ui-schema/ui-schema/PluginStack/Plugin"
import { Errors, SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'

export const ERROR_PATTERN = 'pattern-not-matching'

export function validatePattern(type: SchemaTypesType, value?: any, pattern?: string): boolean

export interface PatternValidatorType extends PluginSimple {
    handle: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: Errors
        valid: boolean
    }
}

export const patternValidator: PatternValidatorType
