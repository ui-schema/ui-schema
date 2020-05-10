import React from "react"
import { validatorPluginExtended } from '@ui-schema/ui-schema/Validators/validate'
import { OrderedMap } from 'immutable'

export type ERROR_CONST_MISMATCH = string
export type ERROR_ENUM_MISMATCH = string

export interface validateEnumProps {
    type: string
    value: any
    schema: OrderedMap<{}, undefined>
}

export function validateEnum(props: validateEnumProps): boolean
export function validateConst(props: validateEnumProps): boolean

// tslint:disable-next-line:no-empty-interface
export interface valueValidatorEnum extends validatorPluginExtended {
}

// tslint:disable-next-line:no-empty-interface
export interface valueValidatorConst extends validatorPluginExtended {
}
