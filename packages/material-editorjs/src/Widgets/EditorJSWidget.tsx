import React from 'react'
import { useUID } from 'react-uid'
import clsx from 'clsx'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { EditorJS } from '@ui-schema/material-editorjs/EditorJS'
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { EditorConfig } from '@editorjs/editorjs'
import { inputClasses } from '@mui/material/Input'
import { Theme, useTheme } from '@mui/material/styles'
import { SxProps } from '@mui/system'

export const useEditorStyles = (theme: Theme, {dense}: { dense?: boolean }): {
    wrapper: SxProps
    editor: SxProps
} => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    editor: {
        position: 'relative',
        marginTop: theme.spacing(2),
        minHeight: dense ? theme.spacing(2.375 + 0.375 + 0.875) : theme.spacing(2.375 + 0.75 + 0.875),
        paddingTop: dense ? theme.spacing(0.375) : theme.spacing(0.75),
        paddingBottom: theme.spacing(0.875),
        '& .cdx-block': {
            lineHeight: '1.2em',
            fontSize: theme.typography.body1.fontSize,
            padding: 0,
        },
        '& .ce-toolbar__plus': {
            left: 0,
        },
        '& .ce-toolbox': {
            left: 34,
        },
        '& .ce-block__content': {
            maxWidth: 'none',
        },
        '& .ce-toolbar__content': {
            maxWidth: 'none',
        },
    },
})

export interface RichContentProps {
    tools: EditorConfig['tools']
    hideTitle?: boolean
}

export const EditorJSWidget = (
    {
        schema, storeKeys,
        showValidity, valid, errors,
        required, tools, hideTitle,
    }: WidgetProps & RichContentProps
): React.ReactElement => {
    const uid = useUID()
    const [focused, setFocused] = React.useState(false)
    const [ready, setReady] = React.useState(false)
    const [empty, setEmpty] = React.useState(true)
    const dense = schema.getIn(['view', 'dense']) as boolean
    const theme = useTheme()
    const styles = useEditorStyles(theme, {dense})
    const onFocus = React.useCallback(() => setFocused(true), [])
    const onBlur = React.useCallback(() => setFocused(false), [])
    const onReady = React.useCallback(() => setReady(true), [])
    const onEmptyChange = React.useCallback((e) => setEmpty(e), [])

    return <FormControl sx={styles.wrapper}>
        {!hideTitle && !schema.getIn(['view', 'hideTitle']) ?
            <InputLabel
                focused={focused} shrink={focused || !empty}
                margin={dense ? 'dense' : undefined}
                error={!valid}
            >
                <TranslateTitle schema={schema} storeKeys={storeKeys}/>
            </InputLabel> : null}

        <Box
            sx={styles.editor}
            className={clsx(
                inputClasses.underline,
                focused ? inputClasses.focused : null
            )}
        >
            <EditorJS
                uid={uid}
                ready={ready}
                onFocus={onFocus}
                onBlur={onBlur}
                onReady={onReady}
                onEmptyChange={onEmptyChange}
                storeKeys={storeKeys}
                tools={tools}
                required={Boolean(schema.get('deleteOnEmpty') || required)}
            />
        </Box>

        <ValidityHelperText
            /* only pass down errors which are not for a specific sub-schema */
            errors={errors}
            showValidity={showValidity}
            schema={schema}
        />
    </FormControl>
}
