import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { PluginProps } from "@ui-schema/ui-schema/PluginStack/Plugin"
import { Errors, StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export const ERROR_MAX_LENGTH = 'min-length'
export const ERROR_MIN_LENGTH = 'max-length'

export function validateMinMax(schema: StoreSchemaType, value: any): Errors

export interface MinMaxValidatorType extends ValidatorPlugin {
    validate: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: Errors
        valid: boolean
    }
}

export const minMaxValidator: MinMaxValidatorType
