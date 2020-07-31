import { List } from 'immutable'
import { onChange, StoreKeys } from "../../EditorStore"

export function moveItem(
    value: List<any>,
    oldI: string | number,
    newI: string | number
): List<any>

export type handleStoreMove = () => void

export function storeMoveItem(
    onChange: onChange,
    storeKeys: StoreKeys,
    go: number
): handleStoreMove
