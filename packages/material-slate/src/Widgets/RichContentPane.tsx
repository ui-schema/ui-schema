import React from 'react'
import { ClassNameMap } from '@mui/styles/withStyles'
import { extractValue, memo, WidgetProps, WithValue } from '@ui-schema/ui-schema'
import { SlateRenderer } from '@ui-schema/material-slate/Slate/SlateRenderer'
import { ElementMapper } from '@ui-schema/material-slate/SlateElements/ElementMapper'
import { PaneWrapper, usePaneEditorStyles } from '@ui-schema/material-slate/EditorWrapper/PaneWrapper'
import { useSlate } from '@ui-schema/material-slate/Slate/useSlate'
import { slatePlugins, withPlugins } from '@ui-schema/material-slate/Slate/slatePlugins'

const RichContentPaneBase: React.ComponentType<WidgetProps & WithValue> = (props) => {
    const {
        /*internalValue,*/ value, schema, storeKeys,
        errors,
        showValidity,
        valid,
    } = props

    const {dense, focused, empty, onFocus, onBlur} = useSlate(schema, value)

    const classes = usePaneEditorStyles({dense: dense as boolean, focused}) as ClassNameMap<'wrapper' | 'editor'>

    return <PaneWrapper
        storeKeys={storeKeys} schema={schema}
        dense={dense as boolean} focused={focused} empty={empty}
        errors={errors} showValidity={showValidity} valid={valid}
        classes={classes}
    >
        <SlateRenderer
            {...props}
            ElementMapper={ElementMapper} plugins={slatePlugins}
            withPlugins={withPlugins}
            onFocus={onFocus} onBlur={onBlur}
        />
    </PaneWrapper>
}

export const RichContentPane: React.ComponentType<WidgetProps> = extractValue(memo(RichContentPaneBase))
