import { OrderedMap } from 'immutable'
import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { PluginProps } from "@ui-schema/ui-schema/PluginStack/Plugin"
import { errors } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_MAX_LENGTH = 'min-length'
export const ERROR_MIN_LENGTH = 'max-length'

export function validateMinMax(schema: OrderedMap<{}, undefined>, value: any): errors

export interface MinMaxValidatorType extends ValidatorPlugin {
    validate: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: errors
        valid: boolean
    }
}

export const minMaxValidator: MinMaxValidatorType
