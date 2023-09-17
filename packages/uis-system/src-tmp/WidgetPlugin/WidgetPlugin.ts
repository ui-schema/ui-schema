import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'

export interface WidgetPluginPayload {
    // current number of plugin in the stack
    currentPluginIndex: number
    errors: ValidatorErrorsType
}
