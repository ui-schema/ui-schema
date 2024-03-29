import { List } from 'immutable'
import { DropTargetMonitor } from 'react-dnd'

export type DndIntentTypeY = 'same' | 'up' | 'down'
export type DndIntentTypeX = 'same' | 'left' | 'right'

export interface DndDragIntentPos {
    x: DndIntentTypeX
    y: DndIntentTypeY
    colX: number
    colY: number
    edgeX: 'right' | 'left' | undefined
    edgeY: 'top' | 'bottom' | undefined
    posQuarter: 'center' | 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right' | undefined
}

export interface DndDragIntentKeys {
    // the intent inside the logical layer

    // level described the movement in the nesting hierarchy
    level?: DndIntentTypeY | 'switch'

    // container describes movement in the list,
    // where one list can be inside one level, and one level can have only one list
    container?: DndIntentTypeY

    isParent?: boolean
    willBeParent?: boolean
    willBeDirectRoot?: boolean

    wasBeforeRelative?: boolean
    toRelativeRootKeys?: List<number>
}

export const DndIntents: {
    [K in DndIntentTypeY | DndIntentTypeX | 'switch']: K
} = {
    switch: 'switch',
    same: 'same',
    up: 'up',
    down: 'down',
    left: 'left',
    right: 'right',
}

//export type PathKey = keyof any
export type PathKey = string | number
export type DataKeys = List<PathKey>

export interface ItemSpec {
    type: string
    id: string
    index: number
    dataKeys: DataKeys
}

export interface OnMovedEvent<C extends HTMLElement = HTMLElement, S extends ItemSpec = ItemSpec> {
    toItem: S
    // the actual item that is moved to the `to*` props
    fromItem: S
    // the html element of the item that `item` is dragged to
    targetElement: C
    monitor: DropTargetMonitor
}
