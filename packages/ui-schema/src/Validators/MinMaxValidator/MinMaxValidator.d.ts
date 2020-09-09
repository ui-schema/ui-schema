import { OrderedMap } from 'immutable'
import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { EditorPluginProps } from "@ui-schema/ui-schema/EditorPlugin"
import { errors } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_MAX_LENGTH = 'min-length'
export const ERROR_MIN_LENGTH = 'max-length'

export function validateMinMax(schema: OrderedMap<{}, undefined>, value: any): errors

export interface MinMaxValidatorType extends ValidatorPlugin {
    validate: (
        {schema, value, errors, valid}: Partial<EditorPluginProps>
    ) => {
        errors: errors
        valid: boolean
    }
}

export const minMaxValidator: MinMaxValidatorType
