import React from "react"
import { OrderedMap, List } from 'immutable'
import { validatorPluginExtended } from '@ui-schema/ui-schema/Validators/validate'

export type ERROR_ADDITIONAL_PROPERTIES = string

export interface validateObjectProps {
    schema: OrderedMap<{}, undefined>
    value: any
}

export function validateObject<P extends validateObjectProps>(props: P): List<P>

// tslint:disable-next-line:no-empty-interface
export interface objectValidator extends validatorPluginExtended {
}
