import React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { WithScalarValue } from '@ui-schema/ui-schema/UIStore'
import { UIStoreActionSet } from '@ui-schema/ui-schema/UIStoreActions'
import { TransTitle } from '@ui-schema/ui-schema/Translate/TransTitle'
import { MuiPickersAdapterContext } from '@mui/x-date-pickers/LocalizationProvider'
import TextField from '@mui/material/TextField'
import { BaseDatePickerProps } from '@mui/x-date-pickers/DatePicker/shared'
import { CalendarPickerView } from '@mui/x-date-pickers/internals/models'
import { List } from 'immutable'

export interface WidgetDatePickerProps<TInputDate, TDate, P extends BaseDatePickerProps<TInputDate, TDate> = BaseDatePickerProps<TInputDate, TDate>> {
    Picker: React.ComponentType<P>
    pickerProps?: any
}

export const WidgetDatePicker: React.FC<WidgetProps & WithScalarValue & WidgetDatePickerProps<any, any>> = (
    {
        value, storeKeys, onChange, schema, required,
        Picker,
        pickerProps,
    },
) => {
    const adapter = React.useContext(MuiPickersAdapterContext)
    const {utils} = adapter || {}
    const dateFormat = (schema.getIn(['date', 'format']) as string | undefined) || 'yyyy-MM-dd'
    const dateFormatData = schema.getIn(['date', 'formatData']) as string || dateFormat
    const dateValue = React.useMemo(
        () =>
            !utils || typeof value === 'undefined' ?
                null : utils.parse(value as string, dateFormatData),
        [value, utils, dateFormatData],
    )

    const viewsList = schema.getIn(['date', 'views'])
    const views = React.useMemo(
        () => List.isList(viewsList) ? viewsList.toArray() as CalendarPickerView[] : [],
        [viewsList],
    )

    const openTo = schema.getIn(['date', 'openTo']) as CalendarPickerView
    const orientation = schema.getIn(['date', 'orientation']) as 'landscape' | 'portrait' | undefined
    if (!views) {
        console.error('WidgetDatePicker invalid, requires `views` at: ', storeKeys.toJS())
    }

    return <Picker
        label={<TransTitle schema={schema} storeKeys={storeKeys}/>}
        value={dateValue}
        inputFormat={dateFormat}
        orientation={orientation}
        openTo={openTo}
        views={views}
        readOnly={schema.get('readOnly') as boolean}
        onChange={(e) => {
            if (!utils) return
            onChange({
                storeKeys: storeKeys,
                scopes: ['value'],
                type: 'set',
                schema,
                required,
                data: {value: e ? utils.formatByString(e, dateFormatData) : ''},
            } as UIStoreActionSet)
        }}
        // todo: pass down textFieldProps
        renderInput={(params) => <TextField {...params} fullWidth/>}
        {...pickerProps || {}}
    />
}
