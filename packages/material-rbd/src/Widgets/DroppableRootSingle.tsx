import React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema'
import { useDragDropContext } from '@ui-schema/material-rbd/DragDropProvider/useDragDropContext'
import { DroppableRoot } from '@ui-schema/material-rbd/DroppableRoot/DroppableRoot'

export const DroppableRootSingle = (
    {schema, storeKeys, ownKey}: WidgetProps
): JSX.Element => {
    const {items} = useDragDropContext()
    return <DroppableRoot
        schema={schema}
        storeKeys={storeKeys}
        ownKey={ownKey}
        type={'$single'}
        hasItems={items?.size > 0}
    />
}
