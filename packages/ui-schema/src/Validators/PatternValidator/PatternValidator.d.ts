import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { EditorPluginProps } from "@ui-schema/ui-schema/EditorPlugin"
import { errors } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_PATTERN = 'pattern-not-matching'

export function validatePattern(type: string, value?: any, pattern?: string): boolean

export interface PatternValidatorType extends ValidatorPlugin {
    validate: (
        {schema, value, errors, valid}: Partial<EditorPluginProps>
    ) => {
        errors: errors
        valid: boolean
    }
}

export const patternValidator: PatternValidatorType
