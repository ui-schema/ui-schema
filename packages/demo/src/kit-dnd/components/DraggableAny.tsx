import React from 'react'
import { Draggable, DraggableProps } from '@ui-schema/kit-dnd/Draggable'
import { DraggableBlock, DraggableBlockProps } from './DraggableBlock'
import { DndValueList } from '@ui-schema/kit-dnd/KitDnd'
import { DraggableArea, DraggableAreaProps } from './DraggableArea'
import { List } from 'immutable'

export interface DraggableAnyProps {
    id: string
    list?: DndValueList
    index: number
    dataKeys: List<number>
    allowedTypes: DraggableProps['allowedTypes']
    itemCount: number
}

export const DraggableAny: React.ComponentType<DraggableAnyProps> = (
    {
        id, list, allowedTypes,
        itemCount,
        dataKeys, index,
    }
) => {
    return typeof list === 'undefined' ?
        <Draggable<HTMLDivElement, DraggableBlockProps>
            Item={DraggableBlock}
            id={id}
            index={index}
            itemCount={itemCount}
            itemType={'BLOCK'}
            dataKeys={dataKeys}
            allowedTypes={allowedTypes}
        /> :
        <Draggable<HTMLDivElement, DraggableAreaProps>
            Item={DraggableArea}
            id={id}
            index={index}
            itemCount={itemCount}
            itemType={'AREA'}
            dataKeys={dataKeys}
            allowedTypes={allowedTypes}
            list={list}
        />
}
