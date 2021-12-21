import React, { Ref } from 'react'
import { Identifier } from 'dnd-core'
import { ItemSpec } from '@ui-schema/kit-dnd/KitDnd'
import { useDrag, useDrop, ConnectDragSource, DropTargetMonitor, DragSourceMonitor } from 'react-dnd'
import { List } from 'immutable'
import { useKitDnd } from '@ui-schema/kit-dnd/KitDndProvider/KitDndProvider'

export interface DraggableBaseProps<ID extends string> {
    id: ID
    index: number
    dataKeys: List<number>
    cols?: number
}

export interface DraggableRendererProps<C extends HTMLElement = HTMLElement, ID extends string = string> extends DraggableBaseProps<ID> {
    isFirst: boolean
    isLast: boolean
    isDragging: boolean
    canDrop: boolean
    isOver: boolean
    scope?: string
    rootRef: Ref<C>
    dragRef: ConnectDragSource
}

export interface OnMovedEvent<C extends HTMLElement = HTMLElement, S extends ItemSpec = ItemSpec, ID extends string = string> {
    // the id of the item to where `item` is moved
    targetId: ID
    toIndex: number
    toType: string
    toDataKeys: List<number>
    // the actual item that is moved to the `to*` props
    item: S
    // the html element of the item that `item` is dragged to
    targetElement: C
    monitor: DropTargetMonitor
}

export type DraggableProps<C extends HTMLElement = HTMLElement,
    D = {},
    T extends string = string,
    ID extends string = string,
    IC extends React.ComponentType<DraggableRendererProps<C, ID> & D> = React.ComponentType<DraggableRendererProps<C, ID> & D>>
    = {
    itemCount: number
    Item: IC
    itemType: T
    allowedTypes: string[] | List<string>
} & DraggableBaseProps<ID> & D

export const DraggableBase = <C extends HTMLElement = HTMLElement,
    D = {},
    T extends string = string,
    S extends ItemSpec = ItemSpec,
    ID extends string = string>(props: DraggableProps<C, D, T, ID>): React.ReactElement => {
    const {
        index, itemCount,
        id,
        Item,
        itemType, allowedTypes,
        dataKeys,
        ...rest
    } = props
    const {onMoved, scope} = useKitDnd<C>()

    const refRoot = React.useRef<C | null>(null)
    const [{isOver, canDrop}, drop] = useDrop<S, S, { handlerId: (Identifier | null), isOver: boolean, canDrop: boolean }>(() => ({
        accept: (scope ? '_' + scope : '_') as string,
        options: {},
        collect: (monitor: DropTargetMonitor<C>) => ({
            isOver: monitor.isOver({shallow: true}),
            canDrop: monitor.canDrop(),
            handlerId: monitor.getHandlerId(),
        }),
        canDrop: (item: S, monitor: DropTargetMonitor<C>) => {
            if (!monitor.isOver({shallow: true})) {
                return false
            }
            return (
                //item.index !== -1 &&
                !item.dataKeys.push(item.index).equals(dataKeys.push(index)) &&
                item.id !== id
            ) && (
                !allowedTypes ||
                allowedTypes.indexOf(item.type) !== -1
            )
        },
        hover(item: S, monitor: DropTargetMonitor<C>) {
            if (monitor.canDrop()) {
                onMoved({
                    targetId: id,
                    targetElement: refRoot.current as C,
                    toIndex: index,
                    toType: itemType,
                    toDataKeys: dataKeys,
                    item: item as unknown as S,
                    monitor,
                })
            }
        },
    }), [id, scope, allowedTypes, index, dataKeys, itemType, refRoot])

    const [{isDragging}, drag, preview] = useDrag<S, S, { isDragging: boolean }>(() => ({
        type: (scope ? '_' + scope : '_') as string,
        item: {
            type: itemType,
            id: id,
            dataKeys: dataKeys,
            index: index,
            scope: scope,
        } as unknown as S,
        collect: (monitor: DragSourceMonitor<S>) => ({
            isDragging: monitor.isDragging(),
        }),
        isDragging: (monitor: DragSourceMonitor<S>) => {
            const tmpItem = monitor.getItem() as S
            if (!tmpItem) return false
            let itemDataKeys = tmpItem.dataKeys as List<number>
            if (!List.isList(itemDataKeys)) {
                itemDataKeys = List(itemDataKeys) as List<number>
            }
            return tmpItem.dataKeys.push(tmpItem.index).equals(dataKeys.push(index)) &&
                itemDataKeys.equals(!List.isList(dataKeys) ? List(dataKeys) : dataKeys)
        },
    }), [id, scope, index, itemType, dataKeys])

    const isLastEntry = index >= (itemCount - 1)

    drop(preview(refRoot))

    return <Item
        id={id}
        index={index}
        scope={scope}
        rootRef={refRoot}
        dragRef={drag}
        isFirst={index === 0}
        isLast={isLastEntry}
        isDragging={isDragging}
        canDrop={canDrop}
        isOver={isOver}
        dataKeys={dataKeys}
        {...rest as D}
    />
}

export const Draggable = React.memo(DraggableBase)
