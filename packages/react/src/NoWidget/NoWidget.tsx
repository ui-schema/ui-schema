import { ReactNode } from 'react'
import { NoWidgetProps } from '@ui-schema/react/Widgets'

export const NoWidget = ({scope, widgetId}: NoWidgetProps): ReactNode => <>missing-{scope}{widgetId ? '-' + widgetId : ''}</>
