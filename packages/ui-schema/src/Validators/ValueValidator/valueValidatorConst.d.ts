import { EditorPluginProps } from "@ui-schema/ui-schema/EditorPlugin"
import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { errors } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_CONST_MISMATCH = 'const-mismatch'

export function validateConst(type: string, _const?: string | number | boolean, value?: any): boolean

export interface ValueValidatorConstType extends ValidatorPlugin {
    should: ({schema, value}: Partial<EditorPluginProps>) => boolean
    validate: (
        {schema, value, errors, valid}: Partial<EditorPluginProps>
    ) => {
        errors: errors
        valid: boolean
    }
}

export const valueValidatorConst: ValueValidatorConstType
