import { TimeViewWithMeridiem } from '@mui/x-date-pickers/internals/models'
import * as React from 'react'
import { WidgetProps } from '@ui-schema/react/Widget'
import { UIStoreActionSet } from '@ui-schema/react/UIStoreActions'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { MuiPickersAdapterContext } from '@mui/x-date-pickers/LocalizationProvider'
import { BaseTimePickerProps } from '@mui/x-date-pickers/TimePicker/shared'
import { List } from 'immutable'

export interface WidgetTimePickerProps<TView extends TimeViewWithMeridiem, P extends BaseTimePickerProps<any, TView> = BaseTimePickerProps<any, TView>> {
    Picker: React.ComponentType<P>
    pickerProps?: any
}

export const WidgetTimePicker: React.FC<WidgetProps & WidgetTimePickerProps<any>> = (
    {
        value, storeKeys, onChange, schema, required,
        Picker,
        pickerProps,
    },
) => {
    const adapter = React.useContext(MuiPickersAdapterContext)
    const {utils} = adapter || {}
    const dense = (schema.getIn(['view', 'dense'], false) as boolean)
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
        () => List.isList(viewsList) ? viewsList.toArray() : undefined,
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
            textField: {
                fullWidth: true,
                size: dense ? 'small' : undefined,
            },
        }}
        {...pickerProps || {}}
    />
}
