import React from 'react'
import Grid, { GridSize, GridSpacing } from '@mui/material/Grid'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { OrderedMap } from 'immutable'
import { GroupRendererProps } from '@ui-schema/react/Widgets'

export const SchemaGridItem: React.ComponentType<React.PropsWithChildren<{
    schema: UISchemaMap
    defaultMd?: GridSize
    style?: React.CSSProperties
    className?: string
    // todo: add correct typing for mui `classes`
    classes?: any
}>> = (
    {
        schema, children,
        defaultMd, style,
        className, classes,
    },
) => {
    const view = schema ? schema.get('view') as OrderedMap<string, GridSize> : undefined

    const viewXs = view ? (view.get('sizeXs') || 12) : 12
    const viewSm = view ? view.get('sizeSm') : undefined
    const viewMd = view ? view.get('sizeMd') : defaultMd as GridSize
    const viewLg = view ? view.get('sizeLg') : undefined
    const viewXl = view ? view.get('sizeXl') : undefined

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    return <Grid
        item
        xs={viewXs}
        sm={viewSm}
        md={viewMd}
        lg={viewLg}
        xl={viewXl}
        style={style}
        className={className}
        classes={classes}
    >
        {children}
    </Grid>
}

export const GroupRenderer: React.ComponentType<React.PropsWithChildren<GroupRendererProps>> = (
    {
        schema, noGrid,
        spacing = 2, style, className,
        children,
    },
) =>
    noGrid ? children as React.ReactElement :
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        <Grid
            container wrap={'wrap'}
            spacing={typeof schema.getIn(['view', 'spacing']) === 'number' ? schema.getIn(['view', 'spacing']) as GridSpacing : spacing as GridSpacing}
            style={style}
            className={className}
        >
            {children}
        </Grid>

export const SchemaGridHandler = <P extends WidgetPluginProps>(props: P): React.ReactElement => {
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

