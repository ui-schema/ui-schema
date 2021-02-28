import React from 'react'
import { onChangeHandler, StoreKeys } from '@ui-schema/ui-schema'
import { List, OrderedMap } from 'immutable'
import {
    DragDropItemDefinition,
    handleDragEnd,
    handleItemAdd,
    handleItemDelete,
    UISchemaDragDropContextType,
} from '../DragDropProvider/useDragDropContext'

import { getNewBlockFromId, handleDragDropEnd } from './storeHelper'

export interface DragDropStoreContext {
    onDragEnd: handleDragEnd
    handleDelete: handleItemDelete
    handleAdd: handleItemAdd
    contextValue: UISchemaDragDropContextType
}

export const makeDragDropContext = (onChange: typeof onChangeHandler, itemsDefs: DragDropItemDefinition = OrderedMap()): DragDropStoreContext => {
    const onDragEnd: handleDragEnd = React.useCallback(
        ({destination, source, type}) => {
            if (destination) {
                onChange(List(), ['value'], ({value}) =>
                    ({
                        value: handleDragDropEnd(itemsDefs, {
                            srcRootId: source.droppableId,
                            srcItemId: source.index,
                            destRootId: destination.droppableId,
                            destItemId: destination.index,
                            type,
                        })(value),
                    })
                )
            }
        }, [onChange, itemsDefs])

    const handleDelete: handleItemDelete = React.useCallback(
        (storeKeys: StoreKeys) =>
            onChange(
                storeKeys.splice(storeKeys.size - 1, 1) as StoreKeys,
                ['value'],
                ({value}) => ({value: value.delete(storeKeys.last())})
            ),
        [onChange])

    const handleAdd: handleItemAdd = React.useCallback(
        (itemId, storeKeys) =>
            onChange(
                storeKeys.splice(storeKeys.size - 1, 1) as StoreKeys,
                ['value'],
                ({value = List()}) =>
                    ({
                        value: (value || List()).splice(storeKeys.last(), 0, getNewBlockFromId(itemsDefs.get(itemId) ? itemId : 'NotFound')),
                    })
            ),
        [onChange, itemsDefs])

    const contextValue: UISchemaDragDropContextType = React.useMemo(() => ({
        handleDragEnd: onDragEnd,
        handleItemDelete: handleDelete,
        handleItemAdd: handleAdd,
        items: itemsDefs,
    }), [onDragEnd, handleDelete, handleAdd, itemsDefs])

    return {
        onDragEnd,
        handleDelete,
        handleAdd,
        contextValue,
    }
}
