import React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { WithScalarValue } from '@ui-schema/ui-schema/UIStore'
import { UIStoreActionSet } from '@ui-schema/ui-schema/UIStoreActions'
import { TransTitle } from '@ui-schema/ui-schema/Translate/TransTitle'
import { MuiPickersAdapterContext } from '@mui/x-date-pickers/LocalizationProvider'
import TextField from '@mui/material/TextField'
import { BaseTimePickerProps } from '@mui/x-date-pickers/TimePicker/shared'
import { List } from 'immutable'
import { ClockPickerView } from '@mui/x-date-pickers/internals/models'

export interface WidgetTimePickerProps<TInputDate, TTime, P extends BaseTimePickerProps<TInputDate, TTime> = BaseTimePickerProps<TInputDate, TTime>> {
    Picker: React.ComponentType<P>
    pickerProps?: any
}

export const WidgetTimePicker: React.FC<WidgetProps & WithScalarValue & WidgetTimePickerProps<any, any>> = (
    {
        value, storeKeys, onChange, schema, required,
        Picker,
        pickerProps,
    }
) => {
    const adapter = React.useContext(MuiPickersAdapterContext)
    const {utils} = adapter || {}
    const dateFormat = (schema.getIn(['date', 'format']) as string | undefined) || 'HH:mm'
    const dateFormatData = schema.getIn(['date', 'formatData']) as string || dateFormat
    const dateValue = React.useMemo(
        () =>
            !utils || typeof value === 'undefined' ?
                null : utils.parse(value as string, dateFormatData),
        [value, utils, dateFormatData],
    )

    const viewsList = schema.getIn(['date', 'views'])
    const views = React.useMemo(
        () => List.isList(viewsList) ? viewsList.toArray() as ClockPickerView[] : undefined,
        [viewsList],
    )

    const openTo = schema.getIn(['date', 'openTo']) as ClockPickerView
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
        renderInput={(params) => <TextField {...params} fullWidth/>}
        {...pickerProps || {}}
    />
}
