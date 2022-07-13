import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'
import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'

export const ERROR_CONST_MISMATCH = 'const-mismatch'

export function validateConst(_const?: string | number | boolean | null, value?: any): boolean

export interface ValueValidatorConstType extends SchemaPlugin {
    should: ({schema, value}: Partial<WidgetPluginProps>) => boolean
    handle: (
        {schema, value, errors, valid}: Partial<WidgetPluginProps>
    ) => {
        errors: ValidatorErrorsType
        valid: boolean
    }
}

export const valueValidatorConst: ValueValidatorConstType
