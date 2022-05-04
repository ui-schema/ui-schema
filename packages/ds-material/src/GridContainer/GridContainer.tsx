import React from 'react'
import Grid from '@mui/material/Grid'
import { PluginStackWrapperProps } from '@ui-schema/ui-schema'

export interface GridContainerProps {
    spacing?: number
}

export const GridContainer: React.FC<GridContainerProps & PluginStackWrapperProps> = (
    {
        spacing = 0,
        children,
    },
) => {
    return <Grid container spacing={spacing}>{children}</Grid>
}
