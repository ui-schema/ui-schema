import React from 'react'
import { useUIMeta, WidgetProps } from '@ui-schema/ui-schema'
import { OrderedMap } from 'immutable'
import { DroppableRoot } from '@ui-schema/material-dnd/DroppableRoot/DroppableRoot'
import { useDragDropContext } from '@ui-schema/material-dnd/DragDropProvider/useDragDropContext'
import { DroppableRootContentProps } from '@ui-schema/material-dnd/DroppableRoot/DroppableRootContent'
import { DraggableBlockProps } from '@ui-schema/material-dnd/DraggableBlock/DraggableBlock'

export const DroppableRootMultiple = ({schema, storeKeys}: WidgetProps): JSX.Element[] | null => {
    const {blocks, handleBlockAdd, handleBlockDelete, getSourceValues, moveDraggedValue} = useDragDropContext()
    const {widgets} = useUIMeta()
    const properties = (schema.get('properties') as OrderedMap<string, any>)

    // todo: make `widget` mapping naming dynamic for `DroppableRootContent` and `DraggableBlock`

    if (!widgets.DroppableRootContent) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Can not display DroppableRootMultiple, missing widgets.DroppableRootContent')
        }
        return null
    }
    if (!widgets.DraggableBlock) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Can not display DroppableRootMultiple, missing widgets.DraggableBlock')
        }
        return null
    }

    return properties ?
        properties.keySeq().toArray().map(rootId =>
            <DroppableRoot
                key={rootId}
                schema={schema}
                ownKey={rootId}
                blocks={blocks}
                getSourceValues={getSourceValues}
                moveDraggedValue={moveDraggedValue}
                handleBlockAdd={handleBlockAdd}
                handleBlockDelete={handleBlockDelete}
                storeKeys={storeKeys.push(rootId)}
                ComponentRootContent={widgets.DroppableRootContent as React.ComponentType<DroppableRootContentProps>}
                ComponentBlock={widgets.DraggableBlock as React.ComponentType<DraggableBlockProps>}
            />
        ) : null
}
