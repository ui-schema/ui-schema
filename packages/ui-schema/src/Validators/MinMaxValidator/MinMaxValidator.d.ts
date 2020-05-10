import * as React from "react"
import { OrderedMap, List } from 'immutable'
import { validatorPlugin } from '@ui-schema/ui-schema/Validators/validate'

export type ERROR_MAX_LENGTH = string
export type ERROR_MIN_LENGTH = string

export interface validateMinMaxProps {
    type: string
    schema: OrderedMap<{}, undefined>
    value: any
    strict: boolean
}

export function validateMinMax<P extends validateMinMaxProps>(props: P): List<P>

// tslint:disable-next-line:no-empty-interface
export interface minMaxValidator extends validatorPlugin {
}
