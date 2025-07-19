import * as React from 'react'
import type { MouseEventHandler } from 'react'
import Grid, { GridSize } from '@mui/material/Grid'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { OrderedMap } from 'immutable'

/**
 * Renders a `@mui/material/Grid` with responsive props for MUI v5/6
 *
 * Use `GridItemPlugin` for MUI 7.
 */
export const SchemaGridItemLegacy: React.ComponentType<React.PropsWithChildren<{
    schema: UISchemaMap
    defaultMd?: GridSize
    style?: React.CSSProperties
    className?: string
    // todo: add correct typing for mui `classes`
    classes?: any
    onContextMenu?: MouseEventHandler<HTMLDivElement>
}>> = (
    {
        schema, children,
        defaultMd, style,
        className, classes,
        onContextMenu,
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
        onContextMenu={onContextMenu}
    >
        {children}
    </Grid>
}

/**
 * Renders a `@mui/material/Grid` with responsive props for MUI v5/6
 *
 * Use `GridItemPlugin` for MUI 7
 *
 * @todo rename to `SchemaGridLegacyItem`?
 */
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
        <SchemaGridItemLegacy schema={schema} style={style}>
            {nestedNext}
        </SchemaGridItemLegacy>
}
