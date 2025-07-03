import { ReactNode } from 'react'
import { NoWidgetProps } from '@ui-schema/react/Widget'

export const NoWidget = ({scope, widgetId}: NoWidgetProps): ReactNode => <>missing-{scope}{widgetId ? '-' + widgetId : ''}</>
