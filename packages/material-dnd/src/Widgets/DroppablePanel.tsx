import React from 'react'
import { useUIMeta, WidgetProps } from '@ui-schema/ui-schema'
import { useDragDropContext } from '@ui-schema/material-dnd/DragDropProvider/useDragDropContext'
import { DroppableRootContentProps } from '@ui-schema/material-dnd/DroppableRoot/DroppableRootContent'
import { DraggableBlockProps } from '@ui-schema/material-dnd/DraggableBlock/DraggableBlock'
import { DroppableWidget } from '@ui-schema/material-dnd/Widgets/DroppableWidget'

export const DroppablePanel: React.ComponentType<WidgetProps & DroppableWidget> = (
    {
        storeKeys, schema,
        widgetNameDroppableRootContent = 'DroppableRootContent',
        widgetNameDraggableBlock = 'DraggableBlock',
    }
) => {
    const {blocks, handleBlockAdd, handleBlockDelete, getSourceValues, moveDraggedValue} = useDragDropContext()
    const {widgets} = useUIMeta()

    // todo: make `widget` mapping naming dynamic for `DroppableRootContent` and `DraggableBlock`

    if (!widgets[widgetNameDroppableRootContent]) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Can not display DroppablePanel, missing widgets.DroppableRootContent')
        }
        return null
    }
    if (!widgets[widgetNameDraggableBlock]) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Can not display DroppablePanel, missing widgets.DraggableBlock')
        }
        return null
    }

    const Component = widgets[widgetNameDroppableRootContent] as React.ComponentType<DroppableRootContentProps>
    return <Component
        storeKeys={storeKeys}
        blocks={blocks}
        schema={schema}
        getSourceValues={getSourceValues}
        moveDraggedValue={moveDraggedValue}
        handleBlockAdd={handleBlockAdd}
        handleBlockDelete={handleBlockDelete}
        ComponentBlock={widgets[widgetNameDraggableBlock] as React.ComponentType<DraggableBlockProps>}
    />
}
