# DS-Material Code

Code editor widgets using CodeMirror, for UI-Schema and Material-UI.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square)](#demo-ui-generator)

- type: `string`, `array`
- widget keywords:
    - `Code` for single `format`
    - `CodeSelectable` for selectable `format: string[]` and data as `[format, code]` array tuple or `{lang, code}` object

>
> 🚧 Work in progress, semi stable [#188](https://github.com/ui-schema/ui-schema/issues/188)
>
> For issues and more check the separate [ui-schema/react-codemirror repository](https://github.com/ui-schema/react-codemirror)

## Install

```bash
npm install --save @ui-schema/ds-material @ui-schema/material-code @ui-schema/kit-codemirror @codemirror/state @codemirror/view @codemirror/language
```

**Uses CodeMirror v6 since `0.4.0-beta.0`.**

## Widgets

**Keywords:**

- `view.hideTitle` when `true` it does not show the title, only the current format
- `format` keyword to select the enabled language mode, `string` or `string[]`
- uses translations: `formats.<schema.format>` for nicer labels, check [examples in docs](https://github.com/ui-schema/ui-schema/blob/master/packages/dictionary/src/en/formats.js)
- only for `CodeSelectable`:
    - `formatDefault` keyword to specify the initial code-language without persisting it in the array
        - must be implemented in your custom widget wire-up

## Hooks

### useEditorTheme

Code editor theming, built using the current MUI theming context, makes it look similar to any other `TextField`.

**Params:**

- `readOnly`: when true, doesn't apply focus / interactive styles

```typescript jsx
import { useEditorTheme } from '@ui-schema/material-code/useEditorTheme'

// in a component:
const {onChange} = props
const theme = useEditorTheme(typeof onChange === 'undefined')
```

### useHighlightStyle

Syntax highlighting theming, built using the current MUI theming context, *not yet that optimized*.

```typescript jsx
import { useHighlightStyle } from '@ui-schema/material-code/useHighlightStyle'

// in a component:
const highlightStyle = useHighlightStyle()
```

## Example

First create a `CustomCodeMirror` component, this component can be used to build the UI-Schema widgets and outside UI-Schema as pure CodeMirror v6 React integration:

```typescript jsx
import React from 'react'
import {
    lineNumbers, highlightActiveLineGutter, highlightSpecialChars,
    drawSelection, dropCursor,
    rectangularSelection, highlightActiveLine, keymap,
} from '@codemirror/view'
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap } from '@codemirror/language'
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { lintKeymap } from '@codemirror/lint'
import { Compartment, EditorState } from '@codemirror/state'
import { CodeMirrorComponentProps, CodeMirror, CodeMirrorProps } from '@ui-schema/kit-codemirror/CodeMirror'
import { useEditorTheme } from '@ui-schema/material-code/useEditorTheme'
import { useHighlightStyle } from '@ui-schema/material-code/useHighlightStyle'

export const CustomCodeMirror: React.FC<CodeMirrorComponentProps> = (
    {
        // values we want to override in this component
        value, extensions,
        // everything else is just passed down
        ...props
    },
) => {
    const {onChange} = props
    const theme = useEditorTheme(typeof onChange === 'undefined')
    const highlightStyle = useHighlightStyle()

    const extensionsAll = React.useMemo(() => [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        syntaxHighlighting(highlightStyle || defaultHighlightStyle, {fallback: true}),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        // crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        new Compartment().of(EditorState.tabSize.of(4)),
        keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...completionKeymap,
            ...lintKeymap,
            indentWithTab,
        ]),
        theme,
        ...(extensions || []),
    ], [highlightStyle, extensions, theme])

    const onViewLifecycle: CodeMirrorProps['onViewLifecycle'] = React.useCallback((view) => {
        console.log('on-view-lifecycle', view)
    }, [])

    return <CodeMirror
        value={value || ''}
        extensions={extensionsAll}
        onViewLifecycle={onViewLifecycle}
        {...props}
        // className={className}
    />
}
```

Then wire up the widgets and build your own widgets binding:

```typescript jsx
import React from 'react'
import {
    WidgetsBindingFactory,
    WidgetProps, WithScalarValue, memo, WithValue, StoreKeyType,
} from '@ui-schema/ui-schema'
import { MuiWidgetsBindingCustom, MuiWidgetsBindingTypes, widgets } from '@ui-schema/ds-material/widgetsBinding'
import Button from '@mui/material/Button'
import { json } from '@codemirror/lang-json'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { extractValue } from '@ui-schema/ui-schema/UIStore'
import { WidgetCode } from '@ui-schema/material-code'
import { WidgetCodeSelectable } from '@ui-schema/material-code/WidgetCodeSelectable'
import { CustomCodeMirror } from './CustomCodeMirror'

export const CustomWidgetCode: React.ComponentType<WidgetProps & WithScalarValue> = (props) => {
    const format = props.schema.get('format')
    // map the to-be-supported CodeMirror language, or add other extensions
    const extensions = React.useMemo(() => [
        ...(format === 'json' ? [json()] : []),
        ...(format === 'javascript' ? [javascript()] : []),
        ...(format === 'html' ? [html()] : []),
        ...(format === 'css' ? [css()] : []),
    ], [format])

    return <WidgetCode
        {...props}
        CodeMirror={CustomCodeMirror}
        // `extensions` will be passed down again to `CustomCodeMirror`
        extensions={extensions}
        formatValue={format}
    />
}

const CustomWidgetCodeSelectableBase: React.ComponentType<WidgetProps & WithValue> = (
    {value, ...props},
) => {
    const {schema, onChange, storeKeys} = props
    const valueType = schema.get('type') as 'array' | 'object'
    // supporting different types requires mapping the actual key of `format` and `value` inside the non-scalar value of this component
    // - for tuples: [0: format, 1: code]
    // - for objects: {lang, code}
    const formatKey: StoreKeyType = valueType === 'array' ? 0 : 'lang'
    const valueKey: StoreKeyType = valueType === 'array' ? 1 : 'code'
    const format = value?.get(formatKey) as string | undefined || schema.get('formatDefault') as string | undefined
    const codeValue = value?.get(valueKey) as string | undefined

    // map the to-be-supported CodeMirror language, or add other extensions
    const extensions = React.useMemo(() => [
        ...(format === 'json' ? [json()] : []),
        ...(format === 'javascript' ? [javascript()] : []),
        ...(format === 'html' ? [html()] : []),
        ...(format === 'css' ? [css()] : []),
    ], [format])

    return <WidgetCodeSelectable
        {...props}
        CodeMirror={CustomCodeMirror}
        // `extensions` will be passed down again to `CustomCodeMirror`
        extensions={extensions}
        formatKey={formatKey}
        valueKey={valueKey}
        value={codeValue}
        formatValue={format}
    />
}
const CustomWidgetCodeSelectable = extractValue(memo(CustomWidgetCodeSelectableBase))

export type CustomWidgetsBinding = WidgetsBindingFactory<{}, MuiWidgetsBindingTypes<{}>, MuiWidgetsBindingCustom<{}>>

export const customWidgets: CustomWidgetsBinding = {
    ...widgets,
    types: widgets.types,
    custom: {
        ...widgets.custom,
        Code: CustomWidgetCode,
        CodeSelectable: CustomWidgetCodeSelectable,
    },
}
```
