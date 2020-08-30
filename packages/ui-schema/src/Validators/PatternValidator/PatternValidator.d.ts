import { List } from "immutable"
import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { EditorPluginProps } from "@ui-schema/ui-schema/EditorPlugin"

export const ERROR_PATTERN = 'pattern-not-matching'

export function validatePattern(type: string, value?: any, pattern?: string): boolean

export interface PatternValidatorType extends ValidatorPlugin {
    validate: (
        {schema, value, errors, valid}: Partial<EditorPluginProps>
    ) => {
        errors: List<any>
        valid: boolean
    }
}

export const patternValidator: PatternValidatorType
