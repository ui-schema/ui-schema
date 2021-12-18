import React from 'react'
import {
    Draggable,
    DraggableProvided,
    DraggableProvidedDragHandleProps,
    DraggableStateSnapshot,
} from 'react-beautiful-dnd'
import { memo, StoreSchemaType, PluginStack, StoreKeys, OwnKey } from '@ui-schema/ui-schema'
import { DragDropItemData } from '@ui-schema/material-rbd/DragDropProvider/useDragDropContext'

export interface ItemBaseProps {
    parentKey?: OwnKey
    storeKeys: StoreKeys
    parentKeys: StoreKeys
    index: number
    schema: StoreSchemaType
    parentSchema: StoreSchemaType
    data: DragDropItemData
    itemsSize: number
    type?: string
}

export interface DragDropItemWrapperProps extends ItemBaseProps {
    dragHandleProps?: DraggableProvidedDragHandleProps
    isDragging: boolean
    isDropAnimating: boolean
    isOverTarget: boolean
    open?: boolean
}

export type DragDropItemWrapperType = React.ComponentType<React.PropsWithChildren<DragDropItemWrapperProps>>

export interface DraggableItemProps extends ItemBaseProps {
    Wrapper?: DragDropItemWrapperType
    open?: DragDropItemWrapperProps['open']
}

export interface ItemProps extends DraggableItemProps {
    provided: DraggableProvided
    snapshot: DraggableStateSnapshot
}

const Item = (
    {
        provided, snapshot,
        parentKey, parentKeys, storeKeys, index,
        schema, parentSchema, type,
        Wrapper, data, itemsSize, open,
    }: ItemProps
) => {
    const isDragging = snapshot.isDragging
    const isDropAnimating = snapshot.isDropAnimating
    const isOverTarget = null !== snapshot.draggingOver && snapshot.isDragging
    return <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...(Wrapper ? {} : provided.dragHandleProps)}
    >
        {Wrapper ? <Wrapper
            type={type}
            parentKeys={parentKeys}
            storeKeys={storeKeys}
            index={index}
            schema={schema}
            parentSchema={parentSchema}
            dragHandleProps={provided.dragHandleProps}
            data={data}
            isDragging={isDragging}
            isDropAnimating={isDropAnimating}
            isOverTarget={isOverTarget}
            itemsSize={itemsSize}
            open={open}
            parentKey={parentKey}
        >
            <PluginStack
                schema={schema} parentSchema={parentSchema}
                storeKeys={storeKeys} level={1}
            />
        </Wrapper> : <PluginStack
            schema={schema.setIn(['view', 'noGrid'], true) as StoreSchemaType} parentSchema={parentSchema}
            storeKeys={storeKeys} level={1}
        />}
    </div>
}

let DraggableItem: React.ComponentType<DraggableItemProps> = (props) => {
    return <Draggable
        draggableId={props.storeKeys.join('...') + '#' + props.data?.get('$bid')}
        index={props.index}
    >
        {(provided, snapshot) =>
            <Item
                provided={provided} snapshot={snapshot}
                {...props}
            />
        }
    </Draggable>
}

// @ts-ignore
DraggableItem = memo(DraggableItem)

export { DraggableItem }
