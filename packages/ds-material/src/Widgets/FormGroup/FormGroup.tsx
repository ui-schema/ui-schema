import React from 'react'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import MuiFormGroup from '@mui/material/FormGroup'
import { useTheme } from '@mui/material/styles'
import { extractValue, WithValue } from '@ui-schema/react/UIStore'
import { memo } from '@ui-schema/react/Utils/memo'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { MuiWidgetsBinding } from '@ui-schema/ds-material/WidgetsBinding'

export const FormGroupBase: React.ComponentType<WidgetProps<MuiWidgetsBinding> & WithValue> = (props) => {
    const {storeKeys, widgets} = props
    const {WidgetRenderer} = widgets
    const {spacing} = useTheme()
    let {schema} = props
    // deleting the `widget` to directly use `WidgetEngine` for nesting
    // with `widget` it would lead to an endless loop
    // using e.g. default `object` renderer then
    // @ts-ignore
    schema = schema.delete('widget')
    return <FormControl
        component="fieldset"
        style={{
            display: 'block',
            marginBottom: spacing(1),
        }}
    >
        <FormLabel component="legend">
            <TranslateTitle schema={schema} storeKeys={storeKeys}/>
        </FormLabel>
        <MuiFormGroup
            style={{
                marginTop: spacing(1),
                marginBottom: spacing(1),
            }}
        >
            {/* @ts-ignore */}
            <WidgetRenderer {...props} schema={schema}/>
        </MuiFormGroup>
        {/*<FormHelperText>Be careful</FormHelperText>*/}
    </FormControl>
}

export const FormGroup = extractValue(memo(FormGroupBase)) as <P extends WidgetProps<MuiWidgetsBinding>>(props: P) => React.ReactElement
