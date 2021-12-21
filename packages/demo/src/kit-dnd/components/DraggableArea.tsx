import React from 'react'
import { DraggableRendererProps, DraggableProps } from '@ui-schema/kit-dnd/Draggable'
import { DndValueList } from '@ui-schema/kit-dnd/KitDnd'
import { DraggableAny } from './DraggableAny'

export interface DraggableAreaProps {
    list: DndValueList | undefined
    allowedTypes: DraggableProps['allowedTypes']
}

export const DraggableArea: React.ComponentType<DraggableAreaProps & DraggableRendererProps<HTMLDivElement, string>> = (
    {
        id, index, rootRef,
        dragRef,
        isDragging, isOver,
        isFirst, isLast,
        list,
        cols = 12,
        dataKeys, allowedTypes,
    }
) => {
    return <div
        ref={rootRef}
        data-item-id={id}
        style={{
            maxWidth: ((cols / 12) * 100) + '%',
            flexBasis: '100%',
            padding: 3,
            margin: 0,
            display: 'flex',
        }}
    >
        <div
            ref={dragRef}
            style={{
                padding: 6,
                border: '1px solid #333333',
                background: !isDragging && isOver ? '#dcecdc' : '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                opacity: isDragging ? 0.4 : 1,
                flexGrow: 1,
                transition: 'opacity 0.25s ease-out, background 0.16s ease-in',
            }}
        >
            <div
                style={{
                    padding: 6,
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <code style={{padding: '0 8px', fontSize: '1rem', lineHeight: '1rem'}}>{index + 1}.</code>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexGrow: 1,
                }}>
                    <span style={{marginRight: 'auto'}}>{id}</span>
                    {isFirst ? <small>isFirst</small> : null}{' '}
                    {isLast ? <small>isLast</small> : null}
                </div>
            </div>
            <div style={{flexGrow: 1}}>
                {list?.map((item, j) =>
                    <DraggableAny
                        key={item.id}
                        dataKeys={dataKeys.push(index)}
                        allowedTypes={allowedTypes}
                        index={j}
                        {...item}
                        itemCount={list.size}/>
                ).valueSeq()}
            </div>
        </div>
    </div>
}
