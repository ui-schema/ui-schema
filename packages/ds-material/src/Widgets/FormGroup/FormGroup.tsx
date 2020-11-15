import React from 'react'
import { WidgetRenderer, TransTitle, WidgetProps } from '@ui-schema/ui-schema'

import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import MuiFormGroup from '@material-ui/core/FormGroup'
//import FormHelperText from '@material-ui/core/FormHelperText'
import { useTheme } from '@material-ui/core/styles'

export const FormGroup = (props: WidgetProps): React.ReactElement => {
    const {storeKeys, ownKey} = props
    const {spacing} = useTheme()
    let {schema} = props
    // deleting the `widget` to directly use `PluginStack` for nesting
    // with `widget` it would lead to an endless loop
    // using e.g. default `object` renderer then
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
