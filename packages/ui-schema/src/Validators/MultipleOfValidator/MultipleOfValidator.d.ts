import { OrderedMap } from 'immutable'
import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { PluginProps } from "@ui-schema/ui-schema/PluginStack/Plugin"
import { errors } from "@ui-schema/ui-schema/CommonTypings"

export const ERROR_MULTIPLE_OF = 'multiple-of'

export function validateMultipleOf(schema: OrderedMap<{}, undefined>, value: any): boolean

export interface MultipleOfValidatorType extends ValidatorPlugin {
    validate: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: errors
        valid: boolean
    }
}

export const multipleOfValidator: MultipleOfValidatorType
