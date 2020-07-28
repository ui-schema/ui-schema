import { OrderedMap, List } from 'immutable'
import { EditorPluginProps } from '@ui-schema/ui-schema/EditorPlugin'

export interface validateReturn {
    errors: List<[]>,
    valid: boolean
}

export type validate = (props: EditorPluginProps) => EditorPluginProps
export type noValidate = (props: EditorPluginProps) => EditorPluginProps
export type should = (props: EditorPluginProps) => boolean

export function validateExtended(
    schema: OrderedMap<{}, undefined>,
    value: any,
    errors: List<[]>,
    valid: boolean,
    required: boolean
): validateReturn

export interface validatorPlugin {
    validate: validate
}

export interface validatorPluginExtended extends validatorPlugin {
    should: should
}

export interface validatorPluginNoValidate extends validatorPluginExtended {
    noValidate: noValidate
}
