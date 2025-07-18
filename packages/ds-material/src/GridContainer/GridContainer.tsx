import Grid, { GridProps, GridTypeMap } from '@mui/material/Grid'
import type { WidgetEngineWrapperProps } from '@ui-schema/react/WidgetEngine'
import type { ElementType } from 'react'

// eslint-disable-next-line @typescript-eslint/no-deprecated
export const GridContainer = <RootComponent extends ElementType = GridTypeMap['defaultComponent']>(
    {
        spacing,
        children,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        schema, storeKeys,
        ...props
        // eslint-disable-next-line @typescript-eslint/no-deprecated
    }: Partial<WidgetEngineWrapperProps> & Omit<GridProps<RootComponent>, 'container' | 'item'>,
) => {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    return <Grid container spacing={spacing || 0} {...props}>{children}</Grid>
}
