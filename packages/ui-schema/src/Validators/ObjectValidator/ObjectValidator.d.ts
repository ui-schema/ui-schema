import { Errors, StoreSchemaType } from "@ui-schema/ui-schema/CommonTypings"
import { ValidatorPlugin } from "@ui-schema/ui-schema/ValidatorStack/ValidatorPlugin"
import { PluginProps } from "@ui-schema/ui-schema/PluginStack/Plugin"
import { ValidatorErrorsType } from '@ui-schema/ui-schema/ValidatorStack/ValidatorErrors'

export const ERROR_ADDITIONAL_PROPERTIES = 'additional-properties'

export function validateObject(schema: StoreSchemaType, value: any): ValidatorErrorsType

export interface ObjectValidatorType extends ValidatorPlugin {
    should: ({schema}: Partial<PluginProps>) => boolean
    validate: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: Errors
        valid: boolean
    }
}

export const objectValidator: ObjectValidatorType
