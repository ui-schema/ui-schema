import { SchemaPlugin } from '@ui-schema/react/SchemaPluginsAdapter/SchemaPlugin'
import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { SchemaTypesType } from '@ui-schema/system/CommonTypings'
import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'

export const ERROR_PATTERN = 'pattern-not-matching'

export function validatePattern(type: SchemaTypesType, value?: any, pattern?: string): boolean

export interface PatternValidatorType extends SchemaPlugin {
    handle: (
        {schema, value, errors, valid}: Partial<WidgetPluginProps>
    ) => {
        errors: ValidatorErrorsType
        valid: boolean
    }
}

export const patternValidator: PatternValidatorType
