import React from 'react'
import ReactEditorJs from 'react-editor-js'
import EditorJSType, { API, OutputData, EditorConfig } from '@editorjs/editorjs'
import { WithValue } from '@ui-schema/react/UIStore'
import { StoreKeys } from '@ui-schema/system/ValueStore'
import { extractValue } from '@ui-schema/react/UIStore'
import { List, Map, OrderedMap } from 'immutable'
import { fromJSOrdered } from '@ui-schema/system/createMap'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export interface EditorJSProps {
    uid: string
    onFocus?: () => void
    onBlur?: () => void
    onReady?: () => void
    onEmptyChange: (empty: boolean) => void
    ready?: boolean
    storeKeys: StoreKeys
    required?: boolean
    tools: EditorConfig['tools']
}

const EditorJSBase: React.ComponentType<EditorJSProps & WithValue> = (
    {
        uid,
        onFocus,
        onBlur,
        onReady,
        ready,
        onChange,
        storeKeys,
        required,
        value,
        internalValue,
        onEmptyChange,
        tools,
    }
) => {
    const editorRef = React.useRef<EditorJSType>()
    const currentState = React.useRef<OrderedMap<any, any> | undefined>(undefined)
    const onChangeEditor = React.useCallback((_api: API, newData?: OutputData) => {
        const newValue = fromJSOrdered(newData)
        if (!currentState.current?.get('blocks')?.equals(newValue?.get('blocks'))) {
            onChange({
                storeKeys,
                scopes: ['value', 'internal'],
                type: 'update',
                updater: ({internal: currentInternal = Map()}) => {
                    currentState.current = newValue
                    return {
                        value: currentState.current,
                        internal: currentInternal.set('isEmpty', Boolean(!(currentState.current?.get('blocks')?.size > 0))),
                    }
                },
                schema: Map({type: 'object'}) as UISchemaMap,
                required,
            })
        }
    }, [onChange, storeKeys, required, currentState])

    const isEmpty = internalValue.get('isEmpty') || !(value?.get('blocks')?.size > 0)

    React.useEffect(() => {
        if (
            // init only when ready and editor ref
            ready && editorRef.current &&
            (
                // and either
                // a) a value is set, but not the same values blocks are already set
                (value && !currentState.current?.get('blocks')?.equals(value?.get('blocks'))) ||
                // b) no value is set, but some value is already set - but the already set value is not "empty" / not without blocks
                (!value && currentState.current && !currentState.current?.get('blocks').equals(List()))
            )
        ) {
            editorRef.current.clear()
            if (value) {
                currentState.current = value
                editorRef.current.render(value.toJS() as any)
            } else {
                currentState.current = fromJSOrdered({
                    blocks: [],
                })
            }
            onChange({
                storeKeys,
                scopes: ['internal'],
                type: 'update',
                updater: ({internal: currentInternal = Map()}) => ({
                    internal: currentInternal.set('isEmpty', Boolean(!(value?.get('blocks')?.size > 0))),
                }),
                schema: Map({type: 'object'}) as UISchemaMap,
                required,
            })
        }
    }, [value, ready, editorRef, currentState, isEmpty, onChange, required, storeKeys, onEmptyChange])

    React.useEffect(() => {
        onEmptyChange(Boolean(typeof isEmpty === 'undefined' ? true : isEmpty))
    }, [isEmpty, onEmptyChange])

    // @ts-ignore
    return <ReactEditorJs
        data={undefined}
        tools={tools}
        instanceRef={instance => editorRef.current = instance}
        enableReInitialize={false}
        onReady={onReady}
        // @ts-ignore
        onChange={onChangeEditor}
        holder={'uis-' + uid + '-editor'}
        minHeight={0}
    >
        <div
            id={'uis-' + uid + '-editor'}
            tabIndex={-1}
            onFocus={onFocus}
            onBlur={onBlur}
            style={{
                visibility: ready ? 'visible' : 'hidden',
                height: ready ? 'auto' : 0,
            }}
        />
    </ReactEditorJs>
}

export const EditorJS = extractValue(EditorJSBase) as React.ComponentType<EditorJSProps>
