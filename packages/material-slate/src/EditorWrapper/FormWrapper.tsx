import React from 'react'
import clsx from 'clsx'
import makeStyles from '@mui/styles/makeStyles'
import { Theme } from '@mui/material/styles'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { inputClasses } from '@mui/material/Input'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { ValidityHelperText } from '@ui-schema/ds-material'
import { MarkdownLabel } from '@ui-schema/material-slate/EditorWrapper/MarkdownLabel'

export const useFormEditorStyles = makeStyles<Theme, { dense: boolean, focused: boolean }, 'wrapper' | 'editor'>(theme => ({
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
        '& .slate-HeadingToolbar': {
            borderBottom: 0,
            opacity: ({focused}) => focused ? 1 : 0,
            pointerEvents: ({focused}) => focused ? 'all' : 'none',
            transition: 'opacity 0.25s ease-out',
            margin: 0,
            padding: '0 ' + theme.spacing(1) + ' 0 ' + theme.spacing(1),
            justifyContent: 'center',
            position: 'absolute' as const,
            top: ({dense}: { dense?: boolean }) => ((dense ? theme.spacing((2 + 0.375) * -1) : theme.spacing((2 + 0.75) * -1))),
            left: 0,
            right: 0,
            minHeight: 0,
        },
    },
}))

export const FormWrapper: React.ComponentType<React.PropsWithChildren<{
    dense: boolean
    focused: boolean
    empty: boolean
    storeKeys: WidgetProps['storeKeys']
    schema: WidgetProps['schema']
    errors: WidgetProps['errors']
    showValidity: WidgetProps['showValidity']
    valid: WidgetProps['valid']
    classes: Record<'wrapper' | 'editor', string>
}>> = (
    {
        storeKeys,
        schema,
        errors,
        showValidity,
        valid,
        children,
        dense,
        focused,
        empty,
        classes,
    }
) => {
    const hideMd = schema.getIn(['view', 'hideMd'])
    return <FormControl className={classes.wrapper}>
        {!hideMd ?
            <MarkdownLabel
                href={schema.getIn(['view', 'linkMd']) as string | undefined}
                enableKeyboard={schema.getIn(['view', 'enableKeyMd']) as boolean | undefined}
                parentFocused={focused}
            /> : null}

        {!schema.getIn(['view', 'hideTitle']) && !schema.getIn(['editor', 'placeholder']) ?
            <InputLabel
                focused={focused} shrink={focused || !empty}
                margin={dense ? 'dense' : undefined}
                error={!valid}
                style={{pointerEvents: 'none'}}
            >
                <TranslateTitle schema={schema} storeKeys={storeKeys}/>
            </InputLabel> : null}
        <div
            className={clsx(
                classes.editor,
                !schema.getIn(['view', 'noUnderline']) ? inputClasses.underline : null,
                focused ? inputClasses.focused : null
            )}
        >
            {children}
        </div>

        <ValidityHelperText
            /* only pass down errors which are not for a specific sub-schema */
            errors={errors}
            showValidity={showValidity}
            schema={schema}
        />
    </FormControl>
}
