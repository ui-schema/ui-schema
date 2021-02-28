import React from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { StoreKeys, StoreSchemaType } from '@ui-schema/ui-schema'
import { List, OrderedMap } from 'immutable'

export type handleDragEnd = (props: {
    destination: DropResult['destination']
    source: DropResult['source']
    type?: DropResult['type']
}) => void
export type handleItemDelete = (storeKeys: StoreKeys) => void
export type handleItemAdd = (itemId: string, storeKeys: StoreKeys) => void

export type DragDropItemData = StoreSchemaType
export type DragDropItemList = List<DragDropItemData>
export type DragDropItemLists = OrderedMap<string, DragDropItemList>
export type DragDropItemDefinition = OrderedMap<string, OrderedMap<string, any>>

export interface UISchemaDragDropContextType {
    items: DragDropItemDefinition
    handleDragEnd: handleDragEnd
    handleItemDelete: handleItemDelete
    handleItemAdd: handleItemAdd
}

// @ts-ignore
export const UISchemaDragDropContext = React.createContext<UISchemaDragDropContextType>({})

export const useDragDropContext = (): UISchemaDragDropContextType => React.useContext<UISchemaDragDropContextType>(UISchemaDragDropContext)
