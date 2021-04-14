import { DraggableBlock } from '@ui-schema/material-dnd'
import { List, Map, OrderedMap } from 'immutable'
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
    const valueListTarget = value.getIn(targetKeys.splice(targetKeys.size - 1, 1))
    if (
        targetKeys.last() >= valueListTarget?.size &&
        typeof value.getIn(targetKeys) === 'undefined' &&
        rootKeysFrom.equals(targetKeys.splice(targetKeys.size - 1, 1))
    ) {
        // fix missing / lost `internals` when dragging rich content
        // - e.g. when rendering DND with existing data where not every item uses `internals`,
        //   the structures like [data1, data2] vs [internal1] can not be moved with splice
        value = value.setIn(targetKeys, undefined)
    }
    return value
        // first remove element from source
        .updateIn(
            rootKeysFrom,
            (list = List()) =>
                // todo: check if best option, what happens/should happen when internal was already set from somewhere else
                (Map.isMap(list) ? List() : list).splice(indexFrom as number, 1)
        )
        // then add element to target
        .updateIn(
            targetKeys.splice(targetKeys.size - 1, 1),
            (list = List()) =>
                // todo: check if best option, what happens/should happen when internal was already set from somewhere else
                (Map.isMap(list) ? List() : list).splice(targetKeys.last() as number, 0, sourceValue)
        )
}
