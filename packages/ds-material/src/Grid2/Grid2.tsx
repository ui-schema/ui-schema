import { Breakpoint } from '@mui/material/styles'
import React, { MouseEventHandler } from 'react'
import Grid2, { GridSize, GridSpacing } from '@mui/material/Grid2'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { OrderedMap } from 'immutable'
import { GroupRendererProps } from '@ui-schema/react/Widget'

/**
 * @experimental not compatible with all widgets
 */
export const SchemaGrid2Item: React.ComponentType<React.PropsWithChildren<{
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
    const view = schema ? schema.get('view') as OrderedMap<string, GridSize> : undefined

    const size: Partial<Record<Breakpoint, GridSize>> = {}
    size.xs = view ? (view.get('sizeXs') || 12) : 12
    size.sm = view ? view.get('sizeSm') : undefined
    size.md = view ? view.get('sizeMd') : defaultMd as GridSize
    size.lg = view ? view.get('sizeLg') : undefined
    size.xl = view ? view.get('sizeXl') : undefined

    return <Grid2
        size={size}
        style={style}
        className={className}
        onContextMenu={onContextMenu}
    >
        {children}
    </Grid2>
}

/**
 * @experimental not compatible with all widgets
 */
export const Group2Renderer: React.ComponentType<React.PropsWithChildren<GroupRendererProps>> = (
    {
        schema, noGrid,
        spacing = 2, style, className,
        children,
    },
) =>
    noGrid ? children as React.ReactElement :
        <Grid2
            container wrap={'wrap'}
            spacing={typeof schema.getIn(['view', 'spacing']) === 'number' ? schema.getIn(['view', 'spacing']) as GridSpacing : spacing as GridSpacing}
            style={style}
            className={className}
        >
            {children}
        </Grid2>

/**
 * @experimental not compatible with all widgets
 */
export const SchemaGrid2Handler = <P extends WidgetPluginProps>(props: P): React.ReactElement => {
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
        <SchemaGrid2Item schema={schema} style={style}>
            {nestedNext}
        </SchemaGrid2Item>
}

