import { List, OrderedMap, Map } from 'immutable'

export type moveDraggedValueType = typeof moveDraggedValue

export type DndValueStoreItem = {
    id: string
    list?: List<DndValueStore | DndValueStoreItem>
}

export type DndValueStore = List<DndValueStore | DndValueStoreItem> | OrderedMap<string, DndValueStore | DndValueStoreItem | any> | Map<string, DndValueStore | DndValueStoreItem | any>

export const moveDraggedValue = <S extends DndValueStore = DndValueStore>(
    store: S,
    fromKeys: List<keyof any>, fromIndex: number,
    toKeys: List<keyof any>, toIndex: number
): S => {
    const item = store.getIn(fromKeys.push(fromIndex))
    //console.log('s-0', store?.toJS())
    // todo: add support for OrderedMap in list level, where fromIndex/toIndex could be a string and the item needs to be always "after that property", ignoring it for Map (there just removing/updating it)
    // @ts-ignore
    store = store
        // first remove element from source
        .updateIn(
            fromKeys,
            // @ts-ignore
            (list: List<DndValueStore | DndValueStoreItem> = List()): List<DndValueStore | DndValueStoreItem> => {
                if ('splice' in list) {
                    return list.splice(fromIndex as number, 1)
                }

                throw new Error('try to move item from list, which is not of type list ' + fromKeys.push(fromIndex).toJS().join('.'))
            },
        )
        // then add element to target
        .updateIn(
            toKeys,
            // @ts-ignore
            (list: List<DndValueStore | DndValueStoreItem> = List()): List<DndValueStore | DndValueStoreItem> => {
                if ('splice' in list) {
                    return list.splice(toIndex, 0, item as DndValueStore | DndValueStoreItem)
                }

                throw new Error('try to move item to list, which is not of type list ' + toKeys.push(toIndex).toJS().join('.'))
            }
        )
    //console.log('s-1', store?.toJS())
    return store
}
