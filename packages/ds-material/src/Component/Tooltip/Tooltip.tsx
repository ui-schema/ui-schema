import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import { visuallyHidden } from '@mui/utils'

/**
 * @todo actual the `span` needs to be INSIDE the actual `children` to be correct for most cases
 *       - parent = IconButton = correct like currently
 *       - parent = ?, children = IconButton = incorrect like currently
 * @todo when the children is e.g. `disabled` button, the tooltip doesn't work
 */
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

        <span style={visuallyHidden as React.CSSProperties}>{title}</span>
    </React.Fragment>
