import { OrderedMap, Map, List } from 'immutable'
import { onChange, StoreKeys } from "../../EditorStore"

export function moveItem<K extends {} | [], V>(
    value: Map<K, V> | OrderedMap<K, V> | List<K>,
    oldI: number,
    newI: number
): Map<K, V> | OrderedMap<K, V> | List<K>

export type handleStoreMove = () => void

export function storeMoveItem<K extends {} | [], V>(
    onChange: onChange,
    storeKeys: StoreKeys,
    go: number
): handleStoreMove
