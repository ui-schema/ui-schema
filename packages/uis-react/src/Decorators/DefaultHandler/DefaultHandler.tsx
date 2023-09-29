import React from 'react'
import { Map } from 'immutable'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { DecoratorPropsNext } from '@tactic-ui/react/Deco'
import { WithValue } from '@ui-schema/react/UIStore'

export interface DefaultHandlerProps {
    doNotDefault?: boolean
    readOnly?: boolean
}

export const DefaultHandler = <P extends WidgetProps & DecoratorPropsNext & WithValue>(props: P & DefaultHandlerProps): React.ReactElement<P> => {
    const {schema, doNotDefault, readOnly} = props

    const defaultVal = schema.get('default')

    const {onChange, storeKeys} = props
    const {value, internalValue} = props

    const valRef = React.useRef(value)
    valRef.current = value
    const defaultHandled = Boolean(internalValue?.get('defaultHandled') || doNotDefault || readOnly || schema?.get('readOnly'))
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

    const Next = props.next(props.decoIndex + 1)
    return <Next {...props} value={nextValue} decoIndex={props.decoIndex + 1}/>
}

