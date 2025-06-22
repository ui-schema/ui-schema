import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import React, { FocusEventHandler } from 'react'
import { List, OrderedMap } from 'immutable'

export type SlateImmutableType = List<OrderedMap<'children', List<OrderedMap<'text' | 'children', string | List<any>>>>>

export function isSlateEmpty(value: List<any> | undefined): boolean {
    return !value?.size || !value.get(0)?.get('children')?.size || value.get(0).get('children').get(0)?.get('text') === ''
}

export const useSlate = (schema: UISchemaMap, value: SlateImmutableType | undefined) => {
    const [focused, setFocus] = React.useState(false)

    const onBlur: FocusEventHandler = React.useCallback(() => {
        setFocus(false)
    }, [setFocus])

    const onFocus: FocusEventHandler = React.useCallback(() => {
        setFocus(true)
    }, [setFocus])

    const dense = schema.getIn(['view', 'dense'])

    const empty = isSlateEmpty(value)

    return {
        focused, setFocus,
        onFocus, onBlur,
        dense, empty,
    }
}
