import { SchemaPlugin } from '@ui-schema/react/SchemaPluginsAdapter/SchemaPlugin'
import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { SchemaTypesType } from '@ui-schema/system/CommonTypings'
import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'

export const ERROR_WRONG_TYPE = 'wrong-type'

export function validateType(value: any, type: SchemaTypesType): boolean

export interface TypeValidatorType extends SchemaPlugin {
    handle: (
        {schema, value, errors, valid}: Partial<WidgetPluginProps>
    ) => {
        errors: ValidatorErrorsType
        valid: boolean
    }
}

export const typeValidator: TypeValidatorType
