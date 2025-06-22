import Grid from '@mui/material/Grid'
import { WidgetEngineWrapperProps } from '@ui-schema/react/WidgetEngine'

export interface GridContainerProps {
    spacing?: number
}

export const GridContainer = (
    {
        spacing = 0,
        children,
    }: GridContainerProps & Partial<WidgetEngineWrapperProps>,
) => {
    return <Grid container spacing={spacing}>{children}</Grid>
}
