import { Errors, StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { PluginSimple } from '@ui-schema/ui-schema/PluginSimpleStack/PluginSimple'
import { PluginProps } from '@ui-schema/ui-schema/PluginStack/Plugin'
import { ValidatorErrorsType } from '@ui-schema/ui-schema/ValidatorErrors'

export const ERROR_ADDITIONAL_PROPERTIES = 'additional-properties'

export function validateObject(schema: StoreSchemaType, value: any): ValidatorErrorsType

export interface ObjectValidatorType extends PluginSimple {
    should: ({schema}: Partial<PluginProps>) => boolean
    handle: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: Errors
        valid: boolean
    }
}

export const objectValidator: ObjectValidatorType
