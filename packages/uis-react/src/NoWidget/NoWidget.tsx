import React from 'react'
import { NoWidgetProps } from '@ui-schema/react/Widgets'

export const NoWidget = ({scope, matching}: NoWidgetProps) => <>missing-{scope}{matching ? '-' + matching : ''}</>
