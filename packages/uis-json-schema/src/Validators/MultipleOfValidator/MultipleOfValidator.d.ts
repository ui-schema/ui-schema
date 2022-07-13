import { SchemaPlugin } from '@ui-schema/react/SchemaPluginsAdapter/SchemaPlugin'
import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'

export const ERROR_MULTIPLE_OF: 'multiple-of'

export function validateMultipleOf(schema: UISchemaMap, value: any): boolean

export interface MultipleOfValidatorType extends SchemaPlugin {
    handle: (
        {schema, value, errors, valid}: Partial<WidgetPluginProps>
    ) => {
        errors: ValidatorErrorsType
        valid: boolean
    }
}

export const multipleOfValidator: MultipleOfValidatorType
