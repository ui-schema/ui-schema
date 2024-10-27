import { widgetMatcher } from '@ui-schema/system/widgetMatcher'
import React from 'react'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import MuiFormGroup from '@mui/material/FormGroup'
import { useTheme } from '@mui/material/styles'
import { extractValue, WithScalarValue, WithValue } from '@ui-schema/react/UIStore'
import { memo } from '@ui-schema/react/Utils/memo'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { MuiWidgetsBinding } from '@ui-schema/ds-material/WidgetsBinding'

export const FormGroupBase: React.ComponentType<WidgetProps<MuiWidgetsBinding> & WithValue> = (props) => {
    const {storeKeys, widgets, schema} = props
    const {spacing} = useTheme()

    // todo: refactor once widgetMatcher exists in `widgets`
    const Widget = widgetMatcher<React.ComponentType<WidgetProps & WithScalarValue>, React.ComponentType<WidgetProps>>({
        widgetName: undefined,
        schemaType: schema.get('type'),
        // @ts-ignore
        widgets: widgets,
    })

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

export const FormGroup = extractValue(memo(FormGroupBase)) as <P extends WidgetProps<MuiWidgetsBinding>>(props: P) => React.ReactElement
