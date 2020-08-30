import { List, OrderedMap } from 'immutable'
import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { EditorPluginProps } from "@ui-schema/ui-schema/EditorPlugin"

export const ERROR_MAX_LENGTH = 'min-length'
export const ERROR_MIN_LENGTH = 'max-length'

export function validateMinMax(schema: OrderedMap<{}, undefined>, value: any): List<any>

export interface MinMaxValidatorType extends ValidatorPlugin {
    validate: (
        {schema, value, errors, valid}: Partial<EditorPluginProps>
    ) => {
        errors: List<any>
        valid: boolean
    }
}

export const minMaxValidator: MinMaxValidatorType
