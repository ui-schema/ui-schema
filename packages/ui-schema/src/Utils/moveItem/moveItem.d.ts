import { List } from 'immutable'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { onChange, StoreKeys } from "@ui-schema/ui-schema/EditorStore"

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
