import { errors, StoreSchemaType } from "@ui-schema/ui-schema/CommonTypings"
import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { EditorPluginProps } from "@ui-schema/ui-schema/EditorPlugin"
import { ValidatorErrorsType } from "@ui-schema/ui-schema/ValidityReporter"

export const ERROR_ADDITIONAL_PROPERTIES = 'additional-properties'

export function validateObject(schema: StoreSchemaType, value: any): ValidatorErrorsType

export interface ObjectValidatorType extends ValidatorPlugin {
    should: ({schema}: Partial<EditorPluginProps>) => boolean
    validate: (
        {schema, value, errors, valid}: Partial<EditorPluginProps>
    ) => {
        errors: errors
        valid: boolean
    }
}

export const objectValidator: ObjectValidatorType
