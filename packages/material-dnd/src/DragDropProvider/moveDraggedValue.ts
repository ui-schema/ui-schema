import { DraggableBlock } from '@ui-schema/material-dnd'
import { List, OrderedMap } from 'immutable'
import { StoreKeys } from '@ui-schema/ui-schema'

export type DragDropContextValueType = List<any> | OrderedMap<string | number, any>

export type moveDraggedValueType = (
    item: DraggableBlock,
    value: DragDropContextValueType,
    sourceValue: any,
    rootKeysFrom: StoreKeys,
    indexFrom: number,
    targetKeys: StoreKeys,
    ignoreMissing?: boolean
) => DragDropContextValueType

export const moveDraggedValue: moveDraggedValueType = (
    _item, value,
    sourceValue,
    rootKeysFrom, indexFrom, targetKeys
): DragDropContextValueType => {
    const toIndex = targetKeys.last() as number
    // @ts-ignore
    return value
        // first remove element from source
        .updateIn(
            rootKeysFrom,
            (list: List<any> = List()): List<any> =>
                list.splice(indexFrom as number, 1)
        )
        // then add element to target
        .updateIn(
            targetKeys.splice(-1, 1),
            (list: List<any> = List()) =>
                (list.size - 1) < toIndex ?
                    // "set undefined at target":
                    // - to fix "Cannot update within non-data-structure value in path ["values","options",0,"choices",0]: undefined"
                    // - e.g. when rendering DND with existing data where not every item uses `internals`,
                    //   the structures like [data1, data2] vs [internal1] can not be moved with splice
                    list.set(toIndex, sourceValue) as List<any> :
                    list.splice(toIndex, 0, sourceValue) as List<any>
        ) as DragDropContextValueType
}
