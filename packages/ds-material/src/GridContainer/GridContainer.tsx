import React from 'react'
import Grid from '@mui/material/Grid'
import { WidgetEngineWrapperProps } from '@ui-schema/react/WidgetEngine'

export interface GridContainerProps {
    spacing?: number
}

export const GridContainer: React.FC<GridContainerProps & WidgetEngineWrapperProps> = (
    {
        spacing = 0,
        children,
    },
) => {
    return <Grid container spacing={spacing}>{children}</Grid>
}
