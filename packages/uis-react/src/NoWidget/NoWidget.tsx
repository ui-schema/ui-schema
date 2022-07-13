import React from 'react'
import { NoWidgetProps } from '@ui-schema/system/widgetMatcher'

export const NoWidget = ({scope, matching}: NoWidgetProps) => <>missing-{scope}{matching ? '-' + matching : ''}</>
