import React from 'react'
import { DraggableLocation, DropResult, TypeId } from 'react-beautiful-dnd'
import { StoreKeys, StoreSchemaType } from '@ui-schema/ui-schema'
import { List, OrderedMap } from 'immutable'

export type handleDragEnd = (props: {
    destination?: DraggableLocation
    source: DropResult['source']
    type?: TypeId
}) => void

export type handleItemDelete = (storeKeys: StoreKeys) => void
export type handleItemAdd = (itemId: string, storeKeys: StoreKeys) => void

export type DragDropItemData = StoreSchemaType
export type DragDropItemList = List<DragDropItemData>
export type DragDropItemLists = OrderedMap<string, DragDropItemList>
export type DragDropItemDefinition = OrderedMap<string, OrderedMap<string, any>>

export interface DragDropSimpleContextType {
    items: DragDropItemDefinition
    handleDragEnd: handleDragEnd
    handleItemDelete: handleItemDelete
    handleItemAdd: handleItemAdd
}

// @ts-ignore
export const UISchemaDragDropContext = React.createContext<DragDropSimpleContextType>({})

export const useDragDropContext = (): DragDropSimpleContextType => React.useContext<DragDropSimpleContextType>(UISchemaDragDropContext)
