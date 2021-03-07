import React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema'
import { OrderedMap } from 'immutable'
import { useDragDropContext } from '@ui-schema/material-rbd/DragDropProvider/useDragDropContext'
import { DroppableRoot } from '@ui-schema/material-rbd/DroppableRoot/DroppableRoot'

//export const DroppableRootMultiple: React.ComponentType<WidgetProps> = (
export const DroppableRootMultiple = (
    {schema, storeKeys}: WidgetProps
): JSX.Element[] | null => {
    const {items} = useDragDropContext()
    const properties = (schema.get('properties') as OrderedMap<string, any>)
    return properties ?
        properties.keySeq().toArray().map(rootId =>
            <DroppableRoot
                key={rootId}
                schema={schema}
                ownKey={rootId}
                storeKeys={storeKeys.push(rootId)}
                hasItems={items?.size > 0}
            />
        ) : null
}
