import * as React from 'react'
import { Map } from 'immutable'
import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'

export interface DefaultHandlerProps {
    doNotDefault?: boolean
    readOnly?: boolean
}

export const DefaultHandler: React.FC<DefaultHandlerProps & WidgetPluginProps> = (props) => {
    const {schema, doNotDefault, readOnly} = props
    const Next = props.Next

    const defaultVal = schema.get('default')

    const {onChange, storeKeys} = props
    const {value, internalValue} = props

    const valRef = React.useRef(value)
    valRef.current = value
    const defaultHandled = Boolean((Map.isMap(internalValue) && internalValue?.get('defaultHandled')) || doNotDefault || readOnly || schema?.get('readOnly'))
    React.useEffect(() => {
        if (defaultHandled) return
        if (typeof defaultVal === 'undefined') return

        if (typeof valRef.current === 'undefined') {
            onChange({
                type: 'update',
                storeKeys: storeKeys,
                scopes: ['value', 'internal'],
                updater: ({internal = Map()}) => ({
                    value: defaultVal,
                    internal: internal.set('defaultHandled', true),
                }),
            })
        } else {
            onChange({
                type: 'update',
                storeKeys: storeKeys,
                scopes: ['internal'],
                updater: ({internal = Map()}) => ({
                    internal: internal.set('defaultHandled', true),
                }),
            })
        }
    }, [onChange, storeKeys, defaultHandled, defaultVal, valRef])

    let nextValue = value
    if (typeof value === 'undefined' && !defaultHandled) {
        nextValue = defaultVal
    }

    if (!Next) return null

    return <Next.Component
        {...props}
        value={nextValue}
    />
}

