import { additionalProps } from '@ui-schema/material-pickers/TimeBase'
import { KeyboardDateTimePickerProps, DateTimePickerProps, KeyboardTimePickerProps, TimePickerProps } from '@material-ui/pickers'
import { WidgetProps } from '@ui-schema/ui-schema'

export interface DateTimeBaseInterface extends WidgetProps {
    additionalProps: additionalProps
    dateFormat?: string
    dateFormatData?: string
    Component: React.ComponentType<any | DateTimePickerProps | KeyboardDateTimePickerProps | KeyboardTimePickerProps | TimePickerProps>
    keyboard?: boolean
}

export function DateTimeBase<P extends DateTimeBaseInterface>(props: P): React.ReactElement
