import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'
import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'

export const ERROR_MAX_LENGTH: 'min-length'
export const ERROR_MIN_LENGTH: 'max-length'

export function validateMinMax(schema: UISchemaMap, value: any): ValidatorErrorsType

export interface MinMaxValidatorType extends SchemaPlugin {
    handle: (
        {schema, value, errors, valid}: Partial<WidgetPluginProps>
    ) => {
        errors: ValidatorErrorsType
        valid: boolean
    }
}

export const minMaxValidator: MinMaxValidatorType
