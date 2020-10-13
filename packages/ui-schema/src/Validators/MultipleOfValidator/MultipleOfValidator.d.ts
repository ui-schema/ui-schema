import { ValidatorPlugin } from "@ui-schema/ui-schema/ValidatorStack/ValidatorPlugin"
import { PluginProps } from "@ui-schema/ui-schema/PluginStack/Plugin"
import { Errors, StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export const ERROR_MULTIPLE_OF = 'multiple-of'

export function validateMultipleOf(schema: StoreSchemaType, value: any): boolean

export interface MultipleOfValidatorType extends ValidatorPlugin {
    validate: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: Errors
        valid: boolean
    }
}

export const multipleOfValidator: MultipleOfValidatorType
