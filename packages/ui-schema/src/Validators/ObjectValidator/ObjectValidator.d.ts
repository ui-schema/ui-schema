import { errors, StoreSchemaType } from "@ui-schema/ui-schema/CommonTypings"
import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { PluginProps } from "@ui-schema/ui-schema/PluginStack/Plugin"
import { ValidatorErrorsType } from "@ui-schema/ui-schema/ValidityReporter"

export const ERROR_ADDITIONAL_PROPERTIES = 'additional-properties'

export function validateObject(schema: StoreSchemaType, value: any): ValidatorErrorsType

export interface ObjectValidatorType extends ValidatorPlugin {
    should: ({schema}: Partial<PluginProps>) => boolean
    validate: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: errors
        valid: boolean
    }
}

export const objectValidator: ObjectValidatorType
