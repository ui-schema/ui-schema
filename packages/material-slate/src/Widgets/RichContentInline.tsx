import React from 'react'
import { extractValue, memo, WidgetProps, WithValue } from '@ui-schema/ui-schema'
import { SlateRenderer } from '@ui-schema/material-slate/Slate/SlateRenderer'
import { FormWrapper, useFormEditorStyles } from '@ui-schema/material-slate/EditorWrapper/FormWrapper'
import { useSlate } from '@ui-schema/material-slate/Slate/useSlate'
import { slatePlugins, withPlugins } from '@ui-schema/material-slate/Slate/slatePlugins'
import { ElementMapperInline } from '@ui-schema/material-slate/SlateElements/ElementMapperInline'

const RichContentInlineBase: React.ComponentType<WidgetProps & WithValue> = (props) => {
    const {
        /*internalValue,*/ value, schema, storeKeys,
        errors,
        showValidity,
        valid,
        ownKey,
    } = props

    const {dense, focused, empty, onFocus, onBlur} = useSlate(schema, value)

    const classes = useFormEditorStyles({dense, focused})

    return <FormWrapper
        ownKey={ownKey} storeKeys={storeKeys} schema={schema}
        dense={dense} focused={focused} empty={empty}
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

export const RichContentInline = extractValue(memo(RichContentInlineBase))
