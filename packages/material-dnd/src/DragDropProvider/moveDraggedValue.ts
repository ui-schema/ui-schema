import { DraggableBlock } from '@ui-schema/material-dnd'
import { List, OrderedMap } from 'immutable'
import { StoreKeys } from '@ui-schema/ui-schema'

export type moveDraggedValueType = (
    item: DraggableBlock,
    value: List<any> | OrderedMap<string | number, any>,
    sourceValue: any,
    rootKeysFrom: StoreKeys, indexFrom: number, targetKeys: StoreKeys,
    ignoreMissing?: boolean
) => List<any> | OrderedMap<string | number, any>

export const moveDraggedValue: moveDraggedValueType = (
    _item, value,
    sourceValue,
    rootKeysFrom, indexFrom, targetKeys
): List<any> | OrderedMap<string | number, any> => {
    const toIndex = targetKeys.last() as number
    return value
        // first remove element from source
        .updateIn(
            rootKeysFrom,
            (list = List()) =>
                list.splice(indexFrom as number, 1)
        )
        // then add element to target
        .updateIn(
            targetKeys.splice(-1, 1),
            (list = List()) =>
                (list.size - 1) < toIndex ?
                    // "set undefined at target":
                    // - to fix "Cannot update within non-data-structure value in path ["values","options",0,"choices",0]: undefined"
                    // - e.g. when rendering DND with existing data where not every item uses `internals`,
                    //   the structures like [data1, data2] vs [internal1] can not be moved with splice
                    list.set(toIndex, sourceValue) :
                    list.splice(toIndex, 0, sourceValue)
        )
}
