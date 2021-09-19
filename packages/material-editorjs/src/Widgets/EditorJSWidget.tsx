import React from 'react'
import { useUID } from 'react-uid'
import clsx from 'clsx'
import { TransTitle } from '@ui-schema/ui-schema/Translate'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { EditorJS } from '@ui-schema/material-editorjs/EditorJS/EditorJS'
import makeStyles from '@material-ui/core/styles/makeStyles'
import FormControl from '@material-ui/core/FormControl'
import { EditorConfig } from '@editorjs/editorjs'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
// @ts-ignore
import { styles as inputStyles } from '@material-ui/core/Input/Input'

import InputLabel from '@material-ui/core/InputLabel'

const useInputStyles = makeStyles(inputStyles)

export const useEditorStyles = makeStyles(theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    editor: {
        position: 'relative',
        marginTop: theme.spacing(2),
        minHeight: ({dense}: { dense?: boolean }) => dense ? theme.spacing(2.375 + 0.375 + 0.875) : theme.spacing(2.375 + 0.75 + 0.875),
        paddingTop: ({dense}: { dense?: boolean }) => dense ? theme.spacing(0.375) : theme.spacing(0.75),
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
}))

export interface RichContentProps {
    tools: EditorConfig['tools']
    hideTitle?: boolean
}

export const EditorJSWidget = (
    {
        schema, storeKeys, ownKey,
        showValidity, valid, errors,
        required, tools, hideTitle,
    }: WidgetProps & RichContentProps
): React.ReactElement => {
    const uid = useUID()
    const [focused, setFocused] = React.useState(false)
    const [ready, setReady] = React.useState(false)
    const [empty, setEmpty] = React.useState(true)
    const dense = schema.getIn(['view', 'dense']) as boolean
    const classes = useEditorStyles({dense})
    const inputClasses = useInputStyles()

    return <FormControl className={classes.wrapper}>
        {!hideTitle && !schema.getIn(['view', 'hideTitle']) ?
            <InputLabel
                focused={focused} shrink={focused || !empty}
                margin={dense ? 'dense' : undefined}
                error={!valid}
            >
                <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
            </InputLabel> : null}

        <div
            className={clsx(
                classes.editor,
                inputClasses.underline,
                focused ? inputClasses.focused : null
            )}
        >
            <EditorJS
                uid={uid}
                ready={ready}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onReady={() => setReady(true)}
                onEmptyChange={(e) => setEmpty(e)}
                storeKeys={storeKeys}
                tools={tools}
                required={Boolean(schema.get('deleteOnEmpty') || required)}
            />
        </div>

        <ValidityHelperText
            /* only pass down errors which are not for a specific sub-schema */
            errors={errors}
            showValidity={showValidity}
            schema={schema}
        />
    </FormControl>
}
