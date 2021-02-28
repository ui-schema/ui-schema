import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { UISchemaDragDropContext, UISchemaDragDropContextType } from '@ui-schema/material-rbd/DragDropProvider/useDragDropContext'

export interface DragDropProviderProps {
    contextValue: UISchemaDragDropContextType
    children?: React.ReactNode
}

export const DragDropProvider: React.ComponentType<DragDropProviderProps> = (
    {contextValue, children}
) => {
    return <UISchemaDragDropContext.Provider value={contextValue}>
        <DragDropContext onDragEnd={contextValue.handleDragEnd}>
            {children}
        </DragDropContext>
    </UISchemaDragDropContext.Provider>
}
