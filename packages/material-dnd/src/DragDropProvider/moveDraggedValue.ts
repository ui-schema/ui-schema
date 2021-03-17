import { DraggableBlock } from '@ui-schema/material-dnd'
import { List, OrderedMap } from 'immutable'
import { StoreKeys } from '@ui-schema/ui-schema'

export type moveDraggedValueType = (
    item: DraggableBlock,
    value: List<any> | OrderedMap<string | number, any>,
    sourceValue: any,
    rootKeysFrom: StoreKeys, indexFrom: number, targetKeys: StoreKeys
) => List<any> | OrderedMap<string | number, any>

export const moveDraggedValue: moveDraggedValueType = (
    _item, value,
    sourceValue,
    rootKeysFrom, indexFrom, targetKeys
): List<any> | OrderedMap<string | number, any> => {
    return value
        // first remove element from source
        .updateIn(
            rootKeysFrom,
            (list = List()) =>
                list.splice(indexFrom as number, 1)
        )
        // then add element to target
        .updateIn(
            targetKeys.splice(targetKeys.size - 1, 1),
            (list = List()) =>
                list.splice(targetKeys.last() as number, 0, sourceValue)
        )
}
