import React from 'react'
import { onChangeHandler, StoreKeys } from '@ui-schema/ui-schema'
import {
    // @ts-ignore
    isImmutable,
    List, OrderedMap,
} from 'immutable'
import {
    DragDropBlockDefinition,
    handleBlockAdd,
    handleBlockDelete,
    DragDropAdvancedContextType,
} from '@ui-schema/material-dnd/DragDropProvider/useDragDropContext'

import { getNewBlockFromId, getSourceValues, getSourceValuesType, moveDraggedValue, moveDraggedValueType } from '@ui-schema/material-dnd/DragDropProvider/storeHelper'

export interface DragDropStoreContext {
    moveDraggedValue: moveDraggedValueType
    getSourceValues: getSourceValuesType
    handleDelete: handleBlockDelete
    handleAdd: handleBlockAdd
    contextValue: DragDropAdvancedContextType
}

export const makeDragDropContext = (onChange: typeof onChangeHandler, blocksDefs: DragDropBlockDefinition = OrderedMap()): DragDropStoreContext => {
    const handleDelete: handleBlockDelete = React.useCallback(
        (storeKeys: StoreKeys) =>
            onChange(
                storeKeys.splice(storeKeys.size - 1, 1) as StoreKeys,
                ['value', 'internal'],
                ({value, internal}) => ({
                    value: value.delete(storeKeys.last()),
                    internal: internal.delete(storeKeys.last()),
                })
            ),
        [onChange])

    const handleAdd: handleBlockAdd = React.useCallback((blockId, storeKeys) => {
        onChange(
            storeKeys.size > 1 ?
                storeKeys.splice(storeKeys.size - 1, 1) as StoreKeys :
                List(),
            ['value', 'internal'],
            ({value = List(), internal = List()}) => {
                if (process.env.NODE_ENV === 'development') {
                    if (!List.isList(value)) {
                        console.error(
                            'DND try to add block to non-list value, ' + (isImmutable(value) ? 'no' : 'is') + ' immutable',
                            isImmutable(value) ? value.toJS() : value
                        )
                        return {
                            value: value,
                            internal: internal,
                        }
                    }
                }
                return {
                    value: (value || List()).splice(storeKeys.last(), 0, getNewBlockFromId(blocksDefs.get(blockId) ? blockId : 'NotFound')),
                    internal: (internal || List()).splice(storeKeys.last(), 0, OrderedMap()),
                }
            }
        )
    }, [onChange, blocksDefs])

    const contextValue: DragDropAdvancedContextType = React.useMemo(() => ({
        moveDraggedValue: moveDraggedValue,
        getSourceValues: getSourceValues,
        handleBlockDelete: handleDelete,
        handleBlockAdd: handleAdd,
        blocks: blocksDefs,
    }), [handleDelete, handleAdd, blocksDefs])

    return {
        moveDraggedValue,
        getSourceValues,
        handleDelete,
        handleAdd,
        contextValue,
    }
}
