import { validatorPluginNoValidate } from '../../Validators/validate'

export type ERROR_NOT_SET = string

export interface checkValueExistsProps {
    type: string
    value: any
}

export function checkValueExists(type: string, value: any): boolean

// tslint:disable-next-line:no-empty-interface
export interface requiredValidator extends validatorPluginNoValidate {
}
