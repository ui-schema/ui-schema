import { WidgetProps } from '@ui-schema/ui-schema'
import { DateTimeOptions } from '@ui-schema/material-pickers/DateTimeBase'

export function TimePicker<P extends {}>(props: P & WidgetProps & DateTimeOptions): React.ReactElement
