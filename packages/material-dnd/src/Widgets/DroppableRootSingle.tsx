import React from 'react'
import { useUIMeta, WidgetProps } from '@ui-schema/ui-schema'
import { DroppableRoot } from '../DroppableRoot/DroppableRoot'
import { useDragDropContext } from '@ui-schema/material-dnd/DragDropProvider/useDragDropContext'
import { DroppableRootContentProps } from '@ui-schema/material-dnd/DroppableRoot/DroppableRootContent'
import { DraggableBlockProps } from '@ui-schema/material-dnd/DraggableBlock/DraggableBlock'

export const DroppableRootSingle: React.ComponentType<WidgetProps> = (
    {schema, storeKeys}
) => {
    const {blocks, handleBlockAdd, handleBlockDelete, getSourceValues,moveDraggedValue} = useDragDropContext()
    const {widgets} = useUIMeta()

    if (!widgets.DroppableRootContent) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Can not display DraggableRootSingle, missing widgets.DroppableRootContent')
        }
        return null
    }
    if (!widgets.DraggableBlock) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Can not display DraggableRootSingle, missing widgets.DraggableBlock')
        }
        return null
    }

    return <DroppableRoot
        schema={schema}
        ownKey={undefined}
        blocks={blocks}
        getSourceValues={getSourceValues}
        moveDraggedValue={moveDraggedValue}
        handleBlockAdd={handleBlockAdd}
        handleBlockDelete={handleBlockDelete}
        storeKeys={storeKeys}
        ComponentRootContent={widgets.DroppableRootContent as React.ComponentType<DroppableRootContentProps>}
        ComponentBlock={widgets.DraggableBlock as React.ComponentType<DraggableBlockProps>}
    />
}
