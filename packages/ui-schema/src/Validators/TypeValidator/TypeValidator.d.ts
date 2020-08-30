import { List } from "immutable"
import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { EditorPluginProps } from "@ui-schema/ui-schema/EditorPlugin"

export const ERROR_WRONG_TYPE = 'wrong-type'

export function validateType(value: any, type: string): boolean

export interface TypeValidatorType extends ValidatorPlugin {
    validate: (
        {schema, value, errors, valid}: Partial<EditorPluginProps>
    ) => {
        errors: List<any>
        valid: boolean
    }
}

export const typeValidator: TypeValidatorType
