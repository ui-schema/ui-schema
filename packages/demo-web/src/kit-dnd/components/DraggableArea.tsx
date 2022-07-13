import React from 'react'
import { DndValueList } from '@ui-schema/kit-dnd/KitDnd'
import { DraggableAny } from './DraggableAny'
import { DraggableRendererProps, useDraggable } from '@ui-schema/kit-dnd/useDraggable'

export interface DraggableAreaProps {
    list: DndValueList | undefined
    cols?: number
}

const allowedTypes = ['BLOCK', 'AREA']

export const DraggableArea: React.ComponentType<DraggableAreaProps & DraggableRendererProps> = (
    {
        id, index,
        isFirst, isLast,
        cols = 12,
        dataKeys, scope,
        list,
    }
) => {
    const refRoot = React.useRef<HTMLDivElement | null>(null)

    const item = React.useMemo(() => ({
        type: 'AREA',
        id: id,
        dataKeys: dataKeys,
        index: index,
    }), [
        id, dataKeys, index,
    ])

    const {
        drop, preview, drag,
        /*canDrop,*/ isOver,
        isDragging,
    } = useDraggable<HTMLDivElement>({
        item, allowedTypes, scope, refRoot,
    })

    drop(preview(refRoot))
    return <div
        ref={refRoot}
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
            // @ts-ignore
            ref={drag(refRoot)}
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
                        index={j}
                        isLast={j >= (list?.size - 1)}
                        isFirst={j === 0}
                        {...item}
                    />
                ).valueSeq()}
            </div>
        </div>
    </div>
}
