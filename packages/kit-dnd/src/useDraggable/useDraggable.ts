import { DataKeys, ItemSpec, useKitDnd } from '@ui-schema/kit-dnd'
import { List } from 'immutable'
import React from 'react'
import { Identifier } from 'dnd-core'
import {
    useDrag, useDrop, DropTargetMonitor,
    DragSourceMonitor,
    ConnectDragSource,
    ConnectDropTarget,
    ConnectDragPreview,
} from 'react-dnd'

export interface DraggableBaseProps {
    id: string
    index: number
    dataKeys: DataKeys
    scope?: string
}

export interface DraggableRendererProps extends DraggableBaseProps {
    isFirst: boolean
    isLast: boolean
}

export const useDraggable = <C extends HTMLElement = HTMLElement, S extends ItemSpec = ItemSpec>(
    {
        item,
        allowedTypes,
        scope: localScope,
        refRoot,
    }: {
        item: S
        allowedTypes: string[] | List<string> | undefined
        scope?: string
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        refRoot: React.MutableRefObject<C | null>
    }
): {
    isOver: boolean
    canDrop: boolean
    drop: ConnectDropTarget
    isDragging: boolean
    drag: ConnectDragSource
    preview: ConnectDragPreview
    setDisableDrag: React.Dispatch<React.SetStateAction<boolean>>
    canDrag: boolean
} => {
    const [disableDrag, setDisableDrag] = React.useState<boolean>(false)
    const {onMove, scope} = useKitDnd<C>()

    const [{isOver, canDrop}, drop] = useDrop<S, S, { handlerId: (Identifier | null), isOver: boolean, canDrop: boolean }>(() => ({
        accept: localScope ? localScope : (scope ? '_' + scope : '_') as string,
        options: {},
        collect: (monitor: DropTargetMonitor<C>) => ({
            isOver: monitor.isOver({shallow: true}),
            canDrop: monitor.canDrop(),
            handlerId: monitor.getHandlerId(),
        }),
        canDrop: (fromItem: S, monitor: DropTargetMonitor<C>) => {
            if (!monitor.isOver({shallow: true})) {
                return false
            }
            return (
                !fromItem.dataKeys.push(fromItem.index).equals(item.dataKeys.push(item.index)) &&
                fromItem.id !== item.id
            ) && (
                !allowedTypes ||
                allowedTypes.indexOf(fromItem.type) !== -1
            )
        },
        hover(fromItem: S, monitor: DropTargetMonitor<C>) {
            if (monitor.canDrop()) {
                onMove({
                    targetElement: refRoot.current as C,
                    toItem: item as unknown as S,
                    fromItem: fromItem as unknown as S,
                    monitor,
                })
            }
        },
    }), [item, localScope, scope, allowedTypes, refRoot])

    const [{canDrag, isDragging}, drag, preview] = useDrag<S, S, { isDragging: boolean, canDrag: boolean }>(() => ({
        type: localScope ? localScope : (scope ? '_' + scope : '_') as string,
        item: {...item},
        collect: (monitor: DragSourceMonitor<S>) => ({
            isDragging: monitor.isDragging(),
            canDrag: monitor.canDrag(),
        }),
        canDrag: () => {
            return !disableDrag
        },
        isDragging: (monitor: DragSourceMonitor<S>) => {
            const {index, dataKeys} = item
            const tmpItem = monitor.getItem() as S
            if (!tmpItem) return false
            let itemDataKeys = tmpItem.dataKeys as List<number>
            if (!List.isList(itemDataKeys)) {
                itemDataKeys = List(itemDataKeys) as List<number>
            }
            return tmpItem.dataKeys.push(tmpItem.index).equals(dataKeys.push(index)) &&
                itemDataKeys.equals(!List.isList(dataKeys) ? List(dataKeys) : dataKeys)
        },
    }), [
        item, localScope, scope, disableDrag,
    ])

    return {
        isOver, canDrop, drop,
        isDragging, drag, preview,
        setDisableDrag,
        // todo: somehow `canDrag` isn't `false` when it is internally `false`
        canDrag: canDrag && !disableDrag,
    }
}
