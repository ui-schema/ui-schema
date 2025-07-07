import React from 'react'
import { DraggableBlock } from './DraggableBlock'
import { DndValueList } from '@ui-schema/kit-dnd/KitDnd'
import { DraggableArea } from './DraggableArea'
import { DraggableRendererProps } from '@ui-schema/kit-dnd/useDraggable'

export interface DraggableAnyProps {
    list?: DndValueList
}

export const DraggableAny: React.ComponentType<DraggableRendererProps & DraggableAnyProps> = (
    {
        id, list,
        dataKeys, index,
        isFirst, isLast, scope,
    }
) => {
    return typeof list === 'undefined' ?
        <DraggableBlock
            id={id}
            index={index}
            dataKeys={dataKeys}
            isFirst={isFirst}
            isLast={isLast}
            scope={scope}
        /> :
        <DraggableArea
            id={id}
            index={index}
            dataKeys={dataKeys}
            isFirst={isFirst}
            isLast={isLast}
            scope={scope}
            // if you build endless nestable grids, use a way that "skips" the list from here to the list-renderer,
            // for performance, as otherwise all elements will re-render no matter how deep a change was
            // e.g. use something React.createContext/useContext or redux
            list={list}
        />
}
