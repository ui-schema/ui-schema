import React from 'react'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { extractValue, WithValue } from '@ui-schema/react/UIStore'
import { memo } from '@ui-schema/react/Utils/memo'
import { SlateRenderer } from '@ui-schema/material-slate/Slate/SlateRenderer'
import { FormWrapper, useFormEditorStyles } from '@ui-schema/material-slate/EditorWrapper'
import { useSlate } from '@ui-schema/material-slate/Slate/useSlate'
import { slatePlugins, withPlugins } from '@ui-schema/material-slate/Slate/slatePlugins'
import { ElementMapperInline } from '@ui-schema/material-slate/SlateElements/ElementMapperInline'

const RichContentInlineBase: React.ComponentType<WidgetProps & WithValue> = (props) => {
    const {
        /*internalValue,*/ value, schema, storeKeys,
        errors,
        showValidity,
        valid,
    } = props

    const {dense, focused, empty, onFocus, onBlur} = useSlate(schema, value)

    const classes = useFormEditorStyles({dense: dense as boolean, focused})

    return <FormWrapper
        storeKeys={storeKeys} schema={schema}
        dense={dense as boolean} focused={focused} empty={empty}
        errors={errors} showValidity={showValidity} valid={valid}
        classes={classes}
    >
        <SlateRenderer
            {...props}
            ElementMapper={ElementMapperInline} plugins={slatePlugins} onlyInline
            withPlugins={withPlugins}
            onFocus={onFocus} onBlur={onBlur}
        />
    </FormWrapper>
}

export const RichContentInline = extractValue(memo(RichContentInlineBase)) as React.ComponentType<WidgetProps>
