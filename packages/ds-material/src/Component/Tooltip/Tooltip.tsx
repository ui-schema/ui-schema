import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import { visuallyHidden } from '@mui/utils'

export const AccessTooltipIcon: React.FC<React.PropsWithChildren<{ title: string | React.ReactElement }>> = (
    {
        title, children,
    },
) =>
    <React.Fragment>
        <Tooltip title={title}>
            {/* @ts-ignore */}
            {children}
        </Tooltip>

        <span style={visuallyHidden}>{title}</span>
    </React.Fragment>
