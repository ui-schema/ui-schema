import { List } from 'immutable'

/**
 * Simple typing for a hierarchical tree of lists with uniform object structures.
 * Can be used for array-key-id mapping strategies and rendering of scalar-data.
 */
export type DndValue = {
    id: string
    list?: DndValueList
}
export type DndValueList = List<DndValue>
