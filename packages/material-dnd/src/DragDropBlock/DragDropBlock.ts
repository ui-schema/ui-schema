import { DndBlock } from '@ui-schema/material-dnd/DragDropBlockProvider'
import React from 'react'

export interface DragDropBlockSelectorProps {
    onSelect: (area: DndBlock) => void
}

export interface DragDropBlockComponentsBinding {
    DndBlockSelector: React.ComponentType<DragDropBlockSelectorProps>
}
