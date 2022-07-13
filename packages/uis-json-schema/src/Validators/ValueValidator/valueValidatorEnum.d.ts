import { List } from 'immutable'
import { WidgetPluginProps } from "@ui-schema/react/WidgetEngine"
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'
import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'

export const ERROR_ENUM_MISMATCH = 'enum-mismatch'

export function validateEnum<T>(_enum?: List<T> | T[], value?: any): boolean

export interface ValueValidatorEnumType extends SchemaPlugin {
    should: ({schema, value}: Partial<WidgetPluginProps>) => boolean
    handle: (
        {schema, value, errors, valid}: Partial<WidgetPluginProps>
    ) => {
        errors: ValidatorErrorsType
        valid: boolean
    }
}

export const valueValidatorEnum: ValueValidatorEnumType
