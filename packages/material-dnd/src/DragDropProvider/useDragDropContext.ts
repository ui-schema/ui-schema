import React from 'react'
import { StoreKeys, StoreSchemaType } from '@ui-schema/ui-schema'
import { List, OrderedMap } from 'immutable'
import { getSourceValuesType } from '@ui-schema/material-dnd/DragDropProvider/getSourceValues'
import { moveDraggedValueType } from '@ui-schema/material-dnd/DragDropProvider/moveDraggedValue'

export type handleBlockDelete = (storeKeys: StoreKeys) => void
export type handleBlockAdd = (blockId: string, storeKeys: StoreKeys) => void

export type DragDropBlockData = StoreSchemaType
export type DragDropBlockList = List<DragDropBlockData>
export type DragDropBlockLists = OrderedMap<string, DragDropBlockList>
export type DragDropBlockDefinition = OrderedMap<string, OrderedMap<string, any>>

export interface DragDropAdvancedContextType {
    blocks: DragDropBlockDefinition
    handleBlockDelete: handleBlockDelete
    handleBlockAdd: handleBlockAdd
    getSourceValues: getSourceValuesType
    moveDraggedValue: moveDraggedValueType
}

// @ts-ignore
export const UISchemaDragDropContext = React.createContext<DragDropAdvancedContextType>({})

export const useDragDropContext = (): DragDropAdvancedContextType => React.useContext<DragDropAdvancedContextType>(UISchemaDragDropContext)
