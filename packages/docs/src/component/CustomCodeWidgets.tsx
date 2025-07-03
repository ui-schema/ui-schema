import { Map } from 'immutable'
import React from 'react'
import Button from '@mui/material/Button'
import { json } from '@codemirror/lang-json'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { extractValue } from '@ui-schema/react/UIStore'
// import { WidgetCode } from '@ui-schema/material-code'
// import { WidgetCodeSelectable } from '@ui-schema/material-code/WidgetCodeSelectable'
import { CustomCodeMirror } from './CustomCodeMirror'
import { WidgetProps } from '@ui-schema/react/Widget'
import { StoreKeyType } from '@ui-schema/ui-schema/ValueStore'
import { memo } from '@ui-schema/react/Utils/memo'

export const CustomWidgetCode: React.ComponentType<WidgetProps> = (props) => {
    const format = props.schema.get('format')
    // map the to-be-supported CodeMirror language, or add other extensions
    const extensions = React.useMemo(() => [
        ...(format === 'json' ? [json()] : []),
        ...(format === 'js' || format === 'javascript' ? [javascript()] : []),
        ...(format === 'html' ? [html()] : []),
        ...(format === 'css' ? [css()] : []),
    ], [format])

    // @ts-ignore
    // eslint-disable-next-line react/jsx-no-undef
    return <WidgetCode
        {...props}
        CodeMirror={CustomCodeMirror}
        // `extensions` will be passed down again to `CustomCodeMirror`
        extensions={extensions}
        formatValue={format}
    />
}

const CustomWidgetCodeSelectableBase: React.ComponentType<WidgetProps> = (
    {value, ...props},
) => {
    const {schema, onChange, storeKeys} = props
    const valueType = schema.get('type') as unknown as 'array' | 'object'
    // supporting different types requires mapping the actual key of `format` and `value` inside the non-scalar value of this component
    // - for tuples: [0: format, 1: code]
    // - for objects: {lang, code}
    const formatKey: StoreKeyType = valueType === 'array' ? 0 : 'lang'
    const valueKey: StoreKeyType = valueType === 'array' ? 1 : 'code'
    const mapValue = Map.isMap(value) ? value : undefined
    const format = mapValue?.get(formatKey) as string | undefined || schema.get('formatDefault') as string | undefined
    const codeValue = mapValue?.get(valueKey) as string | undefined

    // map the to-be-supported CodeMirror language, or add other extensions
    const extensions = React.useMemo(() => [
        ...(format === 'json' ? [json()] : []),
        ...(format === 'js' || format === 'javascript' ? [javascript()] : []),
        ...(format === 'html' ? [html()] : []),
        ...(format === 'css' ? [css()] : []),
    ], [format])

    // @ts-ignore
    // eslint-disable-next-line react/jsx-no-undef
    return <WidgetCodeSelectable
        {...props}
        CodeMirror={CustomCodeMirror}
        // `extensions` will be passed down again to `CustomCodeMirror`
        extensions={extensions}
        formatKey={formatKey}
        valueKey={valueKey}
        value={codeValue}
        formatValue={format}
        barContent={
            format === 'json' ?
                <Button onClick={() => onChange({
                    storeKeys: storeKeys.push(valueKey),
                    scopes: ['value'],
                    type: 'update',
                    updater: ({value}) => {
                        let formattedValue = value
                        try {
                            formattedValue = JSON.stringify(JSON.parse(value), undefined, 4)
                        } catch (e) {
                            // todo: add listeners and state for "formatter failed" and so on
                            console.error(e)
                        }
                        return {
                            value: formattedValue,
                        }
                    },
                    schema,
                })}>
                    beautify code
                </Button> : undefined
        }
    />
}
export const CustomWidgetCodeSelectable = extractValue(memo(CustomWidgetCodeSelectableBase)) as React.ComponentType<WidgetProps>
