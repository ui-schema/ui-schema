import React from 'react'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import MuiFormGroup from '@material-ui/core/FormGroup'
import { useTheme } from '@material-ui/core/styles'
import { extractValue, WithValue } from '@ui-schema/ui-schema/UIStore'
import { memo } from '@ui-schema/ui-schema/Utils'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { TransTitle } from '@ui-schema/ui-schema/Translate/TransTitle'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'

export const FormGroupBase: React.ComponentType<WidgetProps<MuiWidgetBinding> & WithValue> = (props) => {
    const {storeKeys, ownKey, widgets} = props
    const {WidgetRenderer} = widgets
    const {spacing} = useTheme()
    let {schema} = props
    // deleting the `widget` to directly use `PluginStack` for nesting
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
            <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
        </FormLabel>
        <MuiFormGroup
            style={{
                marginTop: spacing(1),
                marginBottom: spacing(1),
            }}
        >
            <WidgetRenderer {...props} schema={schema}/>
        </MuiFormGroup>
        {/*<FormHelperText>Be careful</FormHelperText>*/}
    </FormControl>
}

export const FormGroup: React.ComponentType<WidgetProps<MuiWidgetBinding>> = extractValue(memo(FormGroupBase))
