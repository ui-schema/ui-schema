import { List, OrderedMap } from 'immutable'

export type moveDraggedValueType = typeof moveDraggedValue

export type DndValueStore = List<any> | OrderedMap<string, any>

export const moveDraggedValue = <S extends DndValueStore = DndValueStore>(
    store: S,
    fromKeys: List<keyof any>, fromIndex: number,
    toKeys: List<keyof any>, toIndex: number
): S => {
    let item = store.getIn(fromKeys.push(fromIndex))
    if (typeof item === 'object') {
        item = {...item}
    }
    //console.log('s-0', store?.toJS())
    // @ts-ignore
    store = store
        // first remove element from source
        .updateIn(
            fromKeys,
            (list: List<any> = List()): List<any> =>
                list.splice(fromIndex as number, 1)
        )
        // then add element to target
        .updateIn(
            toKeys,
            (list: List<any> = List()) =>/*
                (list.size - 1) < toIndex ?
                    // "set undefined at target":
                    // - to fix "Cannot update within non-data-structure value in path ["values","options",0,"choices",0]: undefined"
                    // - e.g. when rendering DND with existing data where not every item uses `internals`,
                    //   the structures like [data1, data2] vs [internal1] can not be moved with splice
                    list.set(toIndex, item) as List<any> :*/
                list.splice(toIndex, 0, item) as List<any>
        )
    //console.log('s-1', store?.toJS())
    return store
}
