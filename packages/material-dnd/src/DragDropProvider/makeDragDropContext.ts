import React from 'react'
import { onChangeHandler, StoreKeys } from '@ui-schema/ui-schema'
import {
    // @ts-ignore
    isImmutable,
    List, Map, OrderedMap,
} from 'immutable'
import {
    DragDropBlockDefinition,
    handleBlockAdd,
    handleBlockDelete,
    DragDropAdvancedContextType,
} from '@ui-schema/material-dnd/DragDropProvider/useDragDropContext'

import { getNewBlockFromId } from '@ui-schema/material-dnd/DragDropProvider/storeHelper'
import { moveDraggedValue, moveDraggedValueType } from '@ui-schema/material-dnd/DragDropProvider/moveDraggedValue'
import { getSourceValues, getSourceValuesType } from '@ui-schema/material-dnd/DragDropProvider/getSourceValues'

export interface DragDropStoreContext {
    moveDraggedValue: moveDraggedValueType
    getSourceValues: getSourceValuesType
    handleDelete: handleBlockDelete
    handleAdd: handleBlockAdd
    contextValue: DragDropAdvancedContextType
}

export const makeDragDropContext = (onChange: onChangeHandler, blocksDefs: DragDropBlockDefinition = OrderedMap()): DragDropStoreContext => {
    const handleDelete: handleBlockDelete = React.useCallback(
        (storeKeys: StoreKeys) =>
            onChange(
                storeKeys.splice(-1, 1) as StoreKeys,
                ['value', 'internal'],
                {
                    type: 'list-item-delete',
                    index: storeKeys.last() as number,
                }
            ),
        [onChange])

    const handleAdd: handleBlockAdd = React.useCallback((blockId, storeKeys) => {
        onChange(
            storeKeys.size > 1 ?
                storeKeys.splice(storeKeys.size - 1, 1) as StoreKeys :
                List(),
            ['value', 'internal'],
            ({value = List(), internal = Map()}) => {
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
                    value: (value || List()).splice(storeKeys.last() as number, 0, getNewBlockFromId(blocksDefs.get(blockId) ? blockId : 'NotFound')),
                    internal: internal.update('internals', (internalInternals = List()) =>
                        internalInternals.push(Map())
                    ),
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
