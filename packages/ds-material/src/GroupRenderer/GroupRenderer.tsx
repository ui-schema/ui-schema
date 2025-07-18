import type { ComponentType, PropsWithChildren } from 'react'
import Grid, { GridSpacing } from '@mui/material/Grid'
import type { GroupRendererProps } from '@ui-schema/react/Widget'

/**
 * Renders a `@mui/material/Grid` container with support for the `view.spacing` keyword.
 */
export const GroupRenderer: ComponentType<PropsWithChildren<GroupRendererProps>> = (
    {
        schema, noGrid,
        spacing = 2, style, className,
        children,
    },
) =>
    noGrid ? children :
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        <Grid
            container wrap={'wrap'}
            spacing={typeof schema.getIn(['view', 'spacing']) === 'number' ? schema.getIn(['view', 'spacing']) as GridSpacing : spacing as GridSpacing}
            style={style}
            className={className}
        >
            {children}
        </Grid>
