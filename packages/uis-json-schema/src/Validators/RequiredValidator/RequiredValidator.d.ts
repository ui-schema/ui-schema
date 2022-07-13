import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'
import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'

export const ERROR_NOT_SET = 'required-not-set'

/**
 *
 * @param type
 * @param value
 *
 * @return boolean false when value does not exist per definition for this type, it still may be empty another way
 */
export function checkValueExists(type: string, value: any): boolean

export interface RequiredValidatorType extends SchemaPlugin {
    should: ({requiredList, storeKeys}: Partial<WidgetPluginProps>) => boolean
    handle: (
        {schema, value, errors, valid}: Partial<WidgetPluginProps>
    ) => {
        errors: ValidatorErrorsType
        valid: boolean
        required: true
    }
    noHandle: () => { required: false }
}

export const requiredValidator: RequiredValidatorType
