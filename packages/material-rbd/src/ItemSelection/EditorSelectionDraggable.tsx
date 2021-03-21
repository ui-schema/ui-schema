import React from 'react'
import { List, OrderedMap } from 'immutable'
import { useTheme, Paper } from '@material-ui/core'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { DragDropItemData, useDragDropContext } from '../DragDropProvider/useDragDropContext'
import { TransTitle, memo } from '@ui-schema/ui-schema'

const SelectionItem = (
    {isDragging, isDropAnimating, isOverTarget, item, itemId, className}:
        { isDragging: boolean, isDropAnimating: boolean, isOverTarget: boolean, item: DragDropItemData, itemId: string, className?: string }
) => {
    const {palette} = useTheme()
    return <Paper
        className={className}
        style={(isDragging ? {
            background: isOverTarget && !isDropAnimating ? palette.background.paper : palette.background.default,
            border: '1px solid ' + isOverTarget && !isDropAnimating ? palette.secondary.main : palette.error.main,
        } : {
            background: 'transparent',
            border: '1px solid transparent',
        })}
        elevation={isDragging && !isDropAnimating ? 4 : 0}
    >
        <p style={{margin: 0, padding: 8, minWidth: 60, textAlign: 'center'}}>
            <TransTitle schema={item} storeKeys={List()} ownKey={itemId}/>
        </p>
    </Paper>
}

const DraggableSelectionItem = (
    {isDragging, isDropAnimating, provided, isOverTarget, item, itemId}:
        { isDragging: boolean, isDropAnimating: boolean, provided: any, isOverTarget: boolean, item: OrderedMap<string, any>, itemId: string }
) => {
    return [
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            key={1}
        >
            <SelectionItem isDragging={isDragging} isOverTarget={isOverTarget} isDropAnimating={isDropAnimating} item={item} itemId={itemId}/>
        </div>,
        // placeholder item, during dragging actual item
        isDragging &&
        <SelectionItem key={2} className={'rbd-placeholder-clone'} isDragging={false} isOverTarget={false} isDropAnimating={false} item={item} itemId={itemId}/>,
    ]
}

let EditorSelectionDraggable = () => {
    const {items} = useDragDropContext()
    return <Droppable
        droppableId={'ItemSelection__'}
        isDropDisabled
        direction={'horizontal'}
        ignoreContainerClipping
    >
        {(provided, snapshot) => (
            <div>
                <h4>Select</h4>

                <div
                    className={'flex flex-wrap ' + (snapshot.isDraggingOver ? 'targeted' : '')}
                    style={{border: '1px solid #8e8e8e'}}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {items.keySeq().map((itemId, i) =>
                        <Draggable
                            key={itemId}
                            draggableId={'ItemSelection__#' + itemId}
                            index={i as number}
                        >
                            {(provided, snapshot) =>
                                // @ts-ignore
                                <DraggableSelectionItem
                                    provided={provided}
                                    isDragging={snapshot.isDragging}
                                    isDropAnimating={snapshot.isDropAnimating}
                                    isOverTarget={null !== snapshot.draggingOver && snapshot.isDragging}
                                    itemId={itemId as string}
                                    item={items.get(itemId as string) as OrderedMap<string, any>}
                                />}
                        </Draggable>).valueSeq()}
                    {provided.placeholder}
                </div>
            </div>
        )}
    </Droppable>
}

// @ts-ignore
EditorSelectionDraggable = memo(EditorSelectionDraggable)
export { EditorSelectionDraggable }
