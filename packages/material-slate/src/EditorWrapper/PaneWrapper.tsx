import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { WidgetProps } from '@ui-schema/ui-schema'
import { ValidityHelperText } from '@ui-schema/ds-material'
import { MarkdownLabel } from '@ui-schema/material-slate/EditorWrapper/MarkdownLabel'

export const usePaneEditorStyles = makeStyles<Theme, { dense: boolean, focused: boolean }>(theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        position: 'relative',
    },
    editor: {
        position: 'relative',
        minHeight: theme.spacing(5),
        '& .slate-HeadingToolbar': {
            borderBottom: 0,
            margin: 0,
            padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
            justifyContent: 'center',
        },
    },
}))

export const PaneWrapper: React.ComponentType<React.PropsWithChildren<{
    dense: boolean
    focused: boolean
    empty: boolean
    storeKeys: WidgetProps['storeKeys']
    schema: WidgetProps['schema']
    errors: WidgetProps['errors']
    showValidity: WidgetProps['showValidity']
    valid: WidgetProps['valid']
    ownKey: WidgetProps['ownKey']
    classes: Record<'wrapper' | 'editor', string>
}>> = (
    {
        schema,
        errors,
        showValidity,
        children,
        focused,
        classes,
    }
) => {
    const hideMd = schema.getIn(['view', 'hideMd'])
    return <div className={classes.wrapper}>
        {!hideMd ?
            <MarkdownLabel
                href={schema.getIn(['view', 'linkMd']) as string | undefined}
                enableKeyboard={schema.getIn(['view', 'enableKeyMd']) as boolean | undefined}
                parentFocused={focused}
                top={1}
            /> : null}

        <div className={classes.editor}>
            {children}
        </div>

        <ValidityHelperText
            /* only pass down errors which are not for a specific sub-schema */
            errors={errors}
            showValidity={showValidity}
            schema={schema}
        />
    </div>
}
