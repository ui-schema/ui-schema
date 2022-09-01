import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'
import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'

export const ERROR_ADDITIONAL_PROPERTIES = 'additional-properties'

export function validateObject(schema: UISchemaMap, value: any, recursively?: boolean): ValidatorErrorsType

export interface ObjectValidatorType extends SchemaPlugin {
    handle: (
        {schema, value, errors, valid}: Partial<WidgetPluginProps>
    ) => {
        errors: ValidatorErrorsType
        valid: boolean
    }
}

export const objectValidator: ObjectValidatorType
