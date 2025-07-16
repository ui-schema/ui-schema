import Grid2 from '@mui/material/Grid2'
import { WidgetEngineWrapperProps } from '@ui-schema/react/WidgetEngine'

export interface Grid2ContainerProps {
    spacing?: number
}

/**
 * @experimental not compatible with all widgets
 */
export const Grid2Container = (
    {
        spacing = 0,
        children,
    }: Grid2ContainerProps & Partial<WidgetEngineWrapperProps>,
) => {
    return <Grid2 container spacing={spacing}>{children}</Grid2>
}
