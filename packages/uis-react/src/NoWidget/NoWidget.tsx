import React from 'react'
import { NoWidgetProps } from '@ui-schema/react/Widgets'

// eslint-disable-next-line deprecation/deprecation
export const NoWidget = ({scope, matching}: NoWidgetProps) => <>missing{scope ? '-' + scope : ''}{matching ? '-' + matching : ''}</>
