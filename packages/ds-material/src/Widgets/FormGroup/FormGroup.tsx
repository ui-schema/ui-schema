import * as React from 'react'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import MuiFormGroup from '@mui/material/FormGroup'
import { useTheme } from '@mui/material/styles'
import { extractValue } from '@ui-schema/react/UIStore'
import { memo } from '@ui-schema/react/Utils/memo'
import { WidgetProps } from '@ui-schema/react/Widget'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'

export const FormGroupBase: React.ComponentType<WidgetProps> = (props) => {
    const {storeKeys, binding, schema} = props
    const {spacing} = useTheme()
    const Widget = binding?.matchWidget?.({
        widgetName: undefined,
        schemaType: schema.get('type'),
        widgets: binding?.widgets,
    })?.Widget

    // todo: also render NoWidget?
    if (!Widget) return null

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
            <Widget {...props} schema={schema}/>
        </MuiFormGroup>
        {/*<FormHelperText>Be careful</FormHelperText>*/}
    </FormControl>
}

export const FormGroup = extractValue(memo(FormGroupBase)) as <P extends WidgetProps>(props: P) => React.ReactElement
