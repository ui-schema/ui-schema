import React from 'react'
import AppTheme from './AppTheme'
import { widgets } from '@ui-schema/ds-material'
import { WidgetDatePicker } from '@ui-schema/material-pickers/WidgetDatePicker'
import { WidgetDateTimePicker } from '@ui-schema/material-pickers/WidgetDateTimePicker'
import { WidgetTimePicker } from '@ui-schema/material-pickers/WidgetTimePicker'
import { schemaDatePickers } from './demoDatePickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import Button from '@mui/material/Button'
import { browserT } from './t'
import { createEmptyStore, isInvalid, storeUpdater, UIStoreType, UIMetaProvider, UIStoreProvider, WidgetProps, WithScalarValue, StoreSchemaType, injectPluginStack } from '@ui-schema/ui-schema'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker'
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker'
import { List } from 'immutable'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'

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
    DateTime: CustomDateTimePicker,
    Date: CustomDatePicker,
    Time: CustomTimePicker,
}

const schema = schemaDatePickers
const GridStack = injectPluginStack(GridContainer)
const Main = () => {
    const [showValidity, setShowValidity] = React.useState(false)
    const [store, setStore] = React.useState<UIStoreType>(() => createEmptyStore(schema.get('type') as string))

    const onChangeNext = React.useCallback(
        (actions) => setStore(storeUpdater(actions)),
        [setStore],
    )

    console.log(store.valuesToJS())

    return <>
        <UIStoreProvider
            store={store}
            onChange={onChangeNext}
            showValidity={showValidity}
        >
            <GridStack isRoot schema={schema}/>
        </UIStoreProvider>

        <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
        {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
    </>
}

export const App = () =>
    <LocalizationProvider dateAdapter={AdapterLuxon}>
        <AppTheme>
            <UIMetaProvider widgets={customWidgets} t={browserT}>
                <Main/>
            </UIMetaProvider>
        </AppTheme>
    </LocalizationProvider>
