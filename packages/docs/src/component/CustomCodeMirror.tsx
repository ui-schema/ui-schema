import React from 'react'
import {
    lineNumbers, highlightActiveLineGutter, highlightSpecialChars,
    drawSelection, dropCursor,
    rectangularSelection, highlightActiveLine, keymap,
    // crosshairCursor,
} from '@codemirror/view'
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap } from '@codemirror/language'
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { lintKeymap } from '@codemirror/lint'
import { Compartment, EditorState } from '@codemirror/state'
import { useEditorTheme } from '@ui-schema/material-code/useEditorTheme'
import { useHighlightStyle } from '@ui-schema/material-code/useHighlightStyle'
import { CodeMirrorComponentProps, CodeMirror, CodeMirrorProps } from '@ui-schema/kit-codemirror/CodeMirror'

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
