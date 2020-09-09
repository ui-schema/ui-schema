import { List } from 'immutable'
import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { EditorPluginProps } from "@ui-schema/ui-schema/EditorPlugin"
import { errors } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_ENUM_MISMATCH = 'enum-mismatch'

export function validateEnum<T>(type: string, _enum?: List<any> | T[], value?: any): boolean

export interface ValueValidatorEnumType extends ValidatorPlugin {
    should: ({schema, value}: Partial<EditorPluginProps>) => boolean
    validate: (
        {schema, value, errors, valid}: Partial<EditorPluginProps>
    ) => {
        errors: errors
        valid: boolean
    }
}

export const valueValidatorEnum: ValueValidatorEnumType
