import React, { FocusEventHandler } from 'react'
import { fromJS, List, Map } from 'immutable'
import { Slate, ReactEditor, withReact } from 'slate-react'
import { EditablePlugins as Editable, EditablePluginsProps, pipe, RenderLeaf } from '@udecode/slate-plugins'
import {
    createEditor,
    Descendant,
} from 'slate'
import { withHistory } from 'slate-history'
import { WidgetProps, WithValue } from '@ui-schema/ui-schema'
import { memo } from '@ui-schema/ui-schema/Utils/memo'
import { ElementMapperType } from '@ui-schema/material-slate/SlateElements/ElementMapper'
import { RenderElementProps } from '@ui-schema/material-slate/Slate/SlateTypings'
import { withPlugins, withPluginsType } from '@ui-schema/material-slate/Slate/slatePlugins'
import { SlateToolbarBalloon } from '@ui-schema/material-slate/Slate/SlateToolbarBalloon'
import { SlateToolbarHead } from '@ui-schema/material-slate/Slate/SlateToolbarHead'
import { pluginOptions } from '@ui-schema/material-slate/Slate/pluginOptions'
import { isSlateEmpty } from '@ui-schema/material-slate/Slate/useSlate'

export type BulletedListElement = {
    type: string
    children: Descendant[]
}

export interface SlateRendererProps {
    initialValue?: any
}

const initialValue = [{
    type: pluginOptions.p.type,
    children: [
        {
            text: '',
        },
    ],
}]
export type editorEnableOnly = List<string>
export type SlateHocType<T extends ReactEditor> = (editor: T) => T

let SlateRenderer: React.ComponentType<SlateRendererProps & WidgetProps & WithValue & {
    ElementMapper: ElementMapperType
    onFocus: FocusEventHandler
    onBlur: FocusEventHandler
    className?: string
    onlyInline?: boolean
    withPlugins: withPluginsType
    plugins: EditablePluginsProps['plugins']
    renderLeaf?: RenderLeaf[]
}> = (
    {
        value,
        internalValue,
        onChange,
        storeKeys,
        required,
        schema,
        onFocus,
        onBlur,
        ElementMapper,
        className,
        onlyInline = false,
        plugins,
        renderLeaf,
        withPlugins: withPluginsProp,
    }
) => {
    const enableOnly = schema.getIn(['editor', 'enableOnly']) as editorEnableOnly
    const renderElements = React.useMemo(() => {
        return [
            ({children, ...props}: RenderElementProps): React.JSX.Element =>
                <ElementMapper {...props} enableOnly={enableOnly}>
                    {children}
                </ElementMapper>,
        ]
    }, [ElementMapper, enableOnly])

    const valueRef = React.useRef(value)
    const handledInitial = React.useRef(false)
    const valueIsSameOrInitialised = handledInitial.current && valueRef.current?.equals(value)
    React.useEffect(() => {
        if (!valueIsSameOrInitialised) {
            const handledInitialTemp = handledInitial.current
            handledInitial.current = true
            onChange({
                storeKeys,
                scopes: ['internal', 'value'],
                type: 'update',
                updater: ({internal: currentInternal = Map(), value: storeValue}) => {
                    if (storeValue && storeValue.size) {
                        // handling setting internal value for keyword `default`
                        // must check for really non empty, e.g. when used in root level `value` and `internal` will be an empty list
                        valueRef.current = storeValue
                    } else {
                        valueRef.current = !handledInitialTemp && schema.get('default') ? schema.get('default') as List<any> : List()
                    }
                    if (valueRef.current.size) {
                        currentInternal = currentInternal.set('value', valueRef.current.toJS())
                    } else {
                        const initial = [...initialValue]
                        initial[0] = {...initial[0]}
                        if (schema.getIn(['editor', 'initialRoot'])) {
                            initial[0].type = schema.getIn(['editor', 'initialRoot']) as string
                        } else if (onlyInline) {
                            initial[0].type = 'span'
                        }
                        currentInternal = currentInternal.set('value', initial)
                    }

                    return {
                        internal: currentInternal,
                        value: valueRef.current,
                    }
                },
                schema,
                required,
            })
        }
    }, [valueIsSameOrInitialised, handledInitial, valueRef, schema, required, onChange, onlyInline, storeKeys])

    const withPluginFn = withPluginsProp || withPlugins
    // @ts-ignore
    const editor: ReactEditor = React.useMemo(
        () => pipe(createEditor() as ReactEditor, withReact, withHistory, ...withPluginFn({enableOnly, onlyInline})),
        [withPluginFn, enableOnly, onlyInline]
    )

    const onChangeHandler = React.useCallback((editorValue) => {
        onChange({
            storeKeys,
            scopes: ['value', 'internal'],
            type: 'update',
            updater: ({internal: currentInternal = Map()}) => {
                let newValue = fromJS(editorValue) as List<any>
                if (isSlateEmpty(newValue)) {
                    newValue = List()
                }
                valueRef.current = newValue
                return {
                    value: newValue,
                    internal: currentInternal.set('value', editorValue),
                }
            },
            schema,
            required,
        })
    }, [valueRef, onChange, storeKeys, schema, required])

    return internalValue.get('value') ? <Slate editor={editor} value={internalValue.get('value') || initialValue} onChange={onChangeHandler}>
        {!schema.getIn(['editor', 'hideToolbar']) ?
            <SlateToolbarHead
                enableOnly={enableOnly}
                onlyInline={onlyInline}
                onFocus={onFocus}
                onBlur={onBlur}
            /> : null}
        {!schema.getIn(['editor', 'hideBalloon']) ?
            <SlateToolbarBalloon
                enableOnly={enableOnly}
            /> : null}
        <Editable
            renderElement={renderElements}
            renderLeaf={renderLeaf}
            plugins={plugins}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={schema.getIn(['editor', 'placeholder']) as string | undefined}
            spellCheck={schema.getIn(['editor', 'spellCheck']) as boolean}
            autoFocus={schema.getIn(['editor', 'autoFocus']) as boolean}
            className={className}
        />
    </Slate> : null
}

SlateRenderer = memo(SlateRenderer)
export { SlateRenderer }
