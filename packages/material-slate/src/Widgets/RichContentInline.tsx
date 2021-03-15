import React from 'react'
import { extractValue, WidgetProps, WithValue } from '@ui-schema/ui-schema'
import { SlateRenderer } from '@ui-schema/material-slate/Slate/SlateRenderer'
import { ElementMapper } from '@ui-schema/material-slate/Slate/ElementMapper'
import { FormWrapper, useSlateEditorStyles } from '@ui-schema/material-slate/FormWrapper/FormWrapper'
import { useSlate } from '@ui-schema/material-slate/Slate/useSlate'
import { slatePlugins, withPlugins } from '@ui-schema/material-slate/Slate/slatePlugins'

let RichContentInline: React.ComponentType<WidgetProps & WithValue> = (props) => {
    const {
        /*internalValue,*/ value, schema, storeKeys,
        errors,
        showValidity,
        valid,
        ownKey,
    } = props

    const {dense, focused, empty, onFocus, onBlur} = useSlate(schema, value)

    const classes = useSlateEditorStyles({dense, focused})

    return <FormWrapper
        ownKey={ownKey} storeKeys={storeKeys} schema={schema}
        dense={dense} focused={focused} empty={empty}
        errors={errors} showValidity={showValidity} valid={valid}
        classes={classes}
    >
        <SlateRenderer
            {...props}
            ElementMapper={ElementMapper} plugins={slatePlugins}
            withPlugins={withPlugins}
            onFocus={onFocus} onBlur={onBlur}
        />
    </FormWrapper>
}

RichContentInline = extractValue(RichContentInline)

export { RichContentInline }
