import React from 'react'
import { useUIMeta, WidgetProps } from '@ui-schema/ui-schema'
import { useDragDropContext } from '@ui-schema/material-dnd/DragDropProvider/useDragDropContext'
import { DroppableRootContentProps } from '@ui-schema/material-dnd/DroppableRoot/DroppableRootContent'
import { DraggableBlockProps } from '@ui-schema/material-dnd/DraggableBlock/DraggableBlock'

export const DroppablePanel: React.ComponentType<WidgetProps> = (
    {storeKeys, schema}
) => {
    const {blocks, handleBlockAdd, handleBlockDelete, getSourceValues, moveDraggedValue} = useDragDropContext()
    const {widgets} = useUIMeta()

    if (!widgets.DroppableRootContent) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Can not display DroppablePanel, missing widgets.DroppableRootContent')
        }
        return null
    }
    if (!widgets.DraggableBlock) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Can not display DroppablePanel, missing widgets.DraggableBlock')
        }
        return null
    }

    const Component = widgets.DroppableRootContent as React.ComponentType<DroppableRootContentProps>
    return <Component
        storeKeys={storeKeys}
        blocks={blocks}
        schema={schema}
        getSourceValues={getSourceValues}
        moveDraggedValue={moveDraggedValue}
        handleBlockAdd={handleBlockAdd}
        handleBlockDelete={handleBlockDelete}
        ComponentBlock={widgets.DraggableBlock as React.ComponentType<DraggableBlockProps>}
    />
}
