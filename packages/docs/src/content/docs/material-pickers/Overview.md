# Material UI Picker

> 🚧 Work in progress, docs for `v0.4.0-alpha` of `@ui-schema/material-pickers`
>
> full rewrite for `mui@v5` support, not supporting all old features yet
>
> will stay in alpha, as long as `@mui/x-date-pickers` is in alpha [#187](https://github.com/ui-schema/ui-schema/issues/187)

```bash
npm i --save @ui-schema/material-pickers @mui/x-date-pickers
```

> for peer dependency setup go to [mui.com MUI-X-Pickers](https://mui.com/x/react-date-pickers/getting-started/)

Wire up the provided basic widgets, add support for further props and for those pickers you want.

Use this basic function for a start:

```typescript jsx
import React from 'react'
import { WidgetProps, WithScalarValue, StoreSchemaType } from '@ui-schema/ui-schema'

const getExtraProps = (schema: StoreSchemaType, type: 'date' | 'date-time' | 'time') => {
    const data: { [k: string]: any } = {}
    if (
        schema.getIn(['date', 'variant']) === 'static' ||
        schema.getIn(['date', 'variant']) === 'dialog'
    ) {
        data.clearable = schema.getIn(['date', 'clearable']) as boolean | undefined
        data.showTodayButton = schema.getIn(['date', 'today']) as boolean | undefined
        data.showToolbar = schema.getIn(['date', 'toolbar']) as boolean | undefined
    }
    if (type === 'date-time' || type === 'time') {
        data.ampm = schema.getIn(['date', 'ampm'])
    }
    return data
}
```

> this provides support for some features, previously included in `@ui-schema/material-pickers`@`<=0.3.0`

## Setup Date Time Picker

```typescript jsx
import React from 'react'
import { List } from 'immutable'
import { widgets } from '@ui-schema/ds-material'
import { WidgetProps, WithScalarValue, StoreSchemaType } from '@ui-schema/ui-schema'
import { WidgetDateTimePicker } from '@ui-schema/material-pickers/WidgetDateTimePicker'
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker'
import { getExtraProps } from './lib/PickerUtils'

const CustomDateTimePicker: React.FC<WidgetProps & WithScalarValue> = (props) => {
    const {schema} = props
    const Picker =
        schema.getIn(['date', 'variant']) === 'dialog' ?
            MobileDateTimePicker :
            schema.getIn(['date', 'variant']) === 'static' ?
                StaticDateTimePicker : DesktopDateTimePicker
    const pickerProps = React.useMemo(() => getExtraProps(schema, 'date-time'), [schema])
    return <WidgetDateTimePicker
        {...props}
        Picker={Picker}
        schema={
            // fix fatal error when missing `views`, seems tu be bug in @mui/x
            schema.getIn(['date', 'variant']) === 'static' ?
                schema.setIn(['date', 'views'], List(['year', 'month', 'day', 'hours', 'minutes', 'seconds'])) :
                schema
        }
        pickerProps={pickerProps}
    />
}

const customWidgets = {...widgets}
customWidgets.custom = {
    ...widgets.custom,
    DateTime: CustomDateTimePicker,
}
```

## Setup Date Picker

```typescript jsx
import React from 'react'
import { List } from 'immutable'
import { widgets } from '@ui-schema/ds-material'
import { WidgetProps, WithScalarValue, StoreSchemaType } from '@ui-schema/ui-schema'
import { WidgetDatePicker } from '@ui-schema/material-pickers/WidgetDatePicker'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import { getExtraProps } from './lib/PickerUtils'

const CustomDatePicker: React.FC<WidgetProps & WithScalarValue> = (props) => {
    const {schema} = props
    const Picker =
        schema.getIn(['date', 'variant']) === 'dialog' ?
            MobileDatePicker :
            schema.getIn(['date', 'variant']) === 'static' ?
                StaticDatePicker : DesktopDatePicker
    const pickerProps = React.useMemo(() => getExtraProps(schema, 'date'), [schema])
    return <WidgetDatePicker
        {...props}
        Picker={Picker}
        schema={
            // fix fatal error when missing `views`, seems tu be bug in @mui/x
            schema.getIn(['date', 'variant']) === 'static' ?
                schema.setIn(['date', 'views'], List(['year', 'month', 'day'])) :
                schema
        }
        pickerProps={pickerProps}
    />
}

const customWidgets = {...widgets}
customWidgets.custom = {
    ...widgets.custom,
    Date: CustomDatePicker,
}
```

## Setup Time Picker

```typescript jsx
import React from 'react'
import { List } from 'immutable'
import { widgets } from '@ui-schema/ds-material'
import { WidgetProps, WithScalarValue, StoreSchemaType } from '@ui-schema/ui-schema'
import { WidgetTimePicker } from '@ui-schema/material-pickers/WidgetTimePicker'
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker'
import { getExtraProps } from './lib/PickerUtils'

const CustomTimePicker: React.FC<WidgetProps & WithScalarValue> = (props) => {
    const {schema} = props
    const Picker =
        schema.getIn(['date', 'variant']) === 'dialog' ?
            MobileTimePicker :
            schema.getIn(['date', 'variant']) === 'static' ?
                StaticTimePicker : DesktopTimePicker
    const pickerProps = React.useMemo(() => getExtraProps(schema, 'time'), [schema])
    return <WidgetTimePicker
        {...props}
        Picker={Picker}
        schema={
            // fix fatal error when missing `views`, seems tu be bug in @mui/x
            schema.getIn(['date', 'variant']) === 'static' ?
                schema.setIn(['date', 'views'], List(['hours', 'minutes', 'seconds'])) :
                schema
        }
        pickerProps={pickerProps}
    />
}

const customWidgets = {...widgets}
customWidgets.custom = {
    ...widgets.custom,
    Time: CustomTimePicker,
}
```
