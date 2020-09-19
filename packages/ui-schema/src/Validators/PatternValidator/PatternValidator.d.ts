import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { PluginProps } from "@ui-schema/ui-schema/PluginStack/Plugin"
import { Errors } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_PATTERN = 'pattern-not-matching'

export function validatePattern(type: string, value?: any, pattern?: string): boolean

export interface PatternValidatorType extends ValidatorPlugin {
    validate: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: Errors
        valid: boolean
    }
}

export const patternValidator: PatternValidatorType
