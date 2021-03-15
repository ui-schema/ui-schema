import React, { FocusEventHandler } from 'react'
import { fromJS } from 'immutable'
import { Slate, ReactEditor, withReact } from 'slate-react'
import { EditablePlugins as Editable, EditablePluginsProps, pipe } from '@udecode/slate-plugins'
import {
    createEditor,
    Descendant,
} from 'slate'
import { withHistory } from 'slate-history'
import { memo, WidgetProps, WithValue } from '@ui-schema/ui-schema'
import { ElementMapperType } from '@ui-schema/material-slate/Slate/ElementMapper'
import { RenderElementProps } from '@ui-schema/material-slate/Slate/SlateTypings'
import { withPlugins } from '@ui-schema/material-slate/Slate/slatePlugins'
import { SlateToolbar } from '@ui-schema/material-slate/Slate/SlateToolbar'
import { SlateToolbarHead } from '@ui-schema/material-slate/Slate/SlateToolbarHead'

export type BulletedListElement = {
    type: 'ul'
    children: Descendant[]
}

export interface SlateRendererProps {
    initialValue?: any
}

const initialValue = [{
    type: 'p',
    children: [
        {
            text: '',
        },
    ],
}]

export type SlateHocType<T extends ReactEditor> = (editor: T) => T

let SlateRenderer: React.ComponentType<SlateRendererProps & WidgetProps & WithValue & {
    ElementMapper: ElementMapperType
    onFocus: FocusEventHandler
    onBlur: FocusEventHandler
    className?: string
    withPlugins: SlateHocType<ReactEditor>[]
    plugins: EditablePluginsProps['plugins']
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
        plugins,
    }
) => {
    const dense = schema.getIn(['view', 'dense'])
    const renderElement = React.useCallback(
        ({children, ...props}: RenderElementProps): JSX.Element =>
            <ElementMapper {...props}>
                {children}
            </ElementMapper>,
        [dense]
    )
    const renderElements = React.useMemo(() => {
        return [renderElement]
    }, [renderElement])

    const internalValRef = React.useRef(internalValue)
    if (typeof internalValue === 'undefined') {
        if (value) {
            // handling setting internal value for keyword `default`
            internalValRef.current = value.toJS()
            internalValue = internalValRef.current
        } else {
            internalValue = initialValue
        }
    }

    React.useEffect(() => {
        if (internalValRef.current) {
            onChange(
                storeKeys, ['internal'],
                () => ({
                    internal: internalValRef.current,
                }),
                Boolean(schema.get('deleteOnEmpty') || required),
                'array'
            )
        }
    }, [internalValRef])

    // @ts-ignore
    const editor: ReactEditor = React.useMemo(
        () => pipe(createEditor(), withReact, withHistory, ...withPlugins),
        [withPlugins]
    )

    const onChangeHandler = React.useCallback((editorValue) => {
        onChange(
            storeKeys, ['value', 'internal'],
            () => ({
                value: fromJS(editorValue),
                internal: editorValue,
            }),
            Boolean(schema.get('deleteOnEmpty') || required),
            'array'
        )
    }, [onChange, storeKeys, schema, required])

    return <Slate editor={editor} value={internalValue} onChange={onChangeHandler}>
        <SlateToolbarHead/>
        <SlateToolbar/>
        <Editable
            renderElement={renderElements}
            plugins={plugins}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={schema.get('placeholder') as string | undefined}
            spellCheck={schema.get('spellCheck') as boolean}
            autoFocus={schema.get('autoFocus') as boolean}
            className={className}
        />
    </Slate>
}

SlateRenderer = memo(SlateRenderer)
export { SlateRenderer }
