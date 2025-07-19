import * as React from 'react'
import type { MouseEventHandler } from 'react'
import Grid, { GridSize } from '@mui/material/Grid'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { OrderedMap } from 'immutable'

/**
 * Renders a `@mui/material/Grid` with responsive props for MUI v7.
 *
 * Use `SchemaGridHandler` for MUI 5/6.
 *
 * @experimental only for MUI@v7
 */
export const SchemaGridItem: React.ComponentType<React.PropsWithChildren<{
    schema: UISchemaMap
    defaultMd?: GridSize
    style?: React.CSSProperties
    className?: string
    onContextMenu?: MouseEventHandler<HTMLDivElement>
}>> = (
    {
        schema, children,
        defaultMd, style,
        className,
        onContextMenu,
    },
) => {
    const view = schema?.get('view') as OrderedMap<string, GridSize> | undefined

    const size = {
        xs: view?.get('sizeXs') ?? 12,
        sm: view?.get('sizeSm'),
        md: view?.get('sizeMd') ?? defaultMd,
        lg: view?.get('sizeLg'),
        xl: view?.get('sizeXl'),
    }

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    return <Grid
        size={size}
        style={style}
        className={className}
        onContextMenu={onContextMenu}
    >
        {children}
    </Grid>
}

/**
 * @experimental only for MUI@v7
 */
export const GridItemPlugin = <P extends WidgetPluginProps>(props: P): React.ReactElement => {
    const {schema, noGrid: noGridProp, isVirtual, Next} = props

    const align = schema.getIn(['view', 'align'])
    const style: React.CSSProperties = React.useMemo(() => ({
        textAlign: align as React.CSSProperties['textAlign'],
    }), [align])

    // todo: support `hidden: true` for object type here? e.g. only available after if/else/then eval
    // todo: using `noGrid` may produce an empty `GridContainer` (when all props e.g. hidden/noGrid), can this be optimized?
    const noGrid = (noGridProp || isVirtual || schema.getIn(['view', 'noGrid']))
    const nestedNext = <Next.Component {...props}/>

    return noGrid ? nestedNext :
        <SchemaGridItem schema={schema} style={style}>
            {nestedNext}
        </SchemaGridItem>
}
