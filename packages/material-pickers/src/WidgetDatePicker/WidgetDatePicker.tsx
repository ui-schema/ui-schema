import { BaseDatePickerProps } from '@mui/x-date-pickers/DatePicker/shared'
import { WidgetProps } from '@ui-schema/react/Widget'
import { UIStoreActionSet } from '@ui-schema/react/UIStoreActions'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { MuiPickersAdapterContext } from '@mui/x-date-pickers/LocalizationProvider'
import { List } from 'immutable'
import React from 'react'

export interface WidgetDatePickerProps<P extends BaseDatePickerProps<any> = BaseDatePickerProps<any>> {
    Picker: React.ComponentType<P>
    pickerProps?: any
}

export const WidgetDatePicker: React.FC<WidgetProps & WidgetDatePickerProps> = (
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
        () => List.isList(viewsList) ? viewsList.toArray() : [],
        [viewsList],
    )

    const openTo = schema.getIn(['date', 'openTo'])
    const orientation = schema.getIn(['date', 'orientation']) as 'landscape' | 'portrait' | undefined
    if (!views) {
        console.error('WidgetDatePicker invalid, requires `views` at: ', storeKeys.toJS())
    }

    return <Picker
        label={<TranslateTitle schema={schema} storeKeys={storeKeys}/>}
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
        slotProps={{
            textField: {fullWidth: true},
        }}
        {...pickerProps || {}}
    />
}
