import React from "react"
import { validatorPluginNoValidate } from '@ui-schema/ui-schema/Validators/validate'

export type ERROR_NOT_SET = string

export interface checkValueExistsProps {
    type: string
    value: any
}

export function checkValueExists(props: checkValueExistsProps): boolean

// tslint:disable-next-line:no-empty-interface
export interface requiredValidator extends validatorPluginNoValidate {
}
