import type { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import { OrderedMap } from 'immutable'
import * as React from 'react'
import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import clsx from 'clsx'

export const getGridClasses = (schema: SomeSchema): string[] => {
    const classNameArray: string[] = []
    const view = schema ? schema.getIn(['view']) as OrderedMap<string, number> : undefined
    if (view && view.get('sizeXs')) {
        classNameArray.push('col-' + view.get('sizeXs'))
    } else {
        classNameArray.push('col-12')
    }
    if (view && view.get('sizeSm')) {
        classNameArray.push('col-sm-' + view.get('sizeSm'))
    }
    if (view && view.get('sizeMd')) {
        classNameArray.push('col-md-' + view.get('sizeMd'))
    }
    if (view && view.get('sizeLg')) {
        classNameArray.push('col-lg-' + view.get('sizeLg'))
    }
    if (view && view.get('sizeXl')) {
        classNameArray.push('col-xl-' + view.get('sizeXl'))
    }
    return classNameArray
}

const SchemaGridItem = ({children, schema}: React.PropsWithChildren<{ schema: SomeSchema }>) => {
    return <div
        className={getGridClasses(schema).join(' ')}
    >
        {children}
    </div>
}

const GroupRenderer = ({children}: React.PropsWithChildren) =>
    <div className={clsx('row', 'd-flex', 'row-gap-2', 'flex-wrap')}>
        {children}
    </div>

const SchemaGridHandler = <P extends WidgetPluginProps>(props: P) => {
    const {schema, noGrid, Next, isVirtual} = props

    if (noGrid || isVirtual || schema.getIn(['view', 'noGrid'])) {
        return <Next.Component {...props}/>
    }

    return <SchemaGridItem schema={schema}>
        <Next.Component {...props}/>
    </SchemaGridItem>
}

export { SchemaGridHandler, SchemaGridItem, GroupRenderer }
