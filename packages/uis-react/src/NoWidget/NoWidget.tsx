import { ReactNode } from 'react'
import { NoWidgetProps } from '@ui-schema/react/Widgets'

export const NoWidget = ({scope, matching}: NoWidgetProps): ReactNode => <>missing-{scope}{matching ? '-' + matching : ''}</>
