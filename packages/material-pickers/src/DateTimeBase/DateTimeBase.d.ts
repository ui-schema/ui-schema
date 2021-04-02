import { AdditionalProps } from '@ui-schema/material-pickers/TimeBase'
import { KeyboardDateTimePickerProps, DateTimePickerProps, KeyboardTimePickerProps, TimePickerProps } from '@material-ui/pickers'
import { WidgetProps } from '@ui-schema/ui-schema'

export interface DateTimeOptions {
    additionalProps?: AdditionalProps
    dateFormat?: string
    dateFormatData?: string
    Component?: React.ComponentType<any | DateTimePickerProps | KeyboardDateTimePickerProps | KeyboardTimePickerProps | TimePickerProps>
    keyboard?: boolean
}

export interface DateTimeBaseInterface extends DateTimeOptions {
    Component: React.ComponentType<any | DateTimePickerProps | KeyboardDateTimePickerProps | KeyboardTimePickerProps | TimePickerProps>
}

export function DateTimeBase<P extends {}>(props: P & DateTimeBaseInterface & WidgetProps): React.ReactElement
