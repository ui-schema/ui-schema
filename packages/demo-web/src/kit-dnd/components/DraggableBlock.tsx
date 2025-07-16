import React from 'react'
import { DraggableRendererProps, useDraggable } from '@ui-schema/kit-dnd/useDraggable'

export interface DraggableBlockProps {
    fullDrag?: boolean
    cols?: number
}

const allowedTypes = ['BLOCK', 'AREA']

export const DraggableBlock: React.ComponentType<DraggableRendererProps & DraggableBlockProps> = (
    {
        id, index,
        isFirst, isLast,
        cols = 12,
        fullDrag,
        dataKeys, scope,
    }
) => {
    const refRoot = React.useRef<HTMLDivElement | null>(null)

    const item = React.useMemo(() => ({
        type: 'BLOCK',
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
    const rr = fullDrag ? drag(refRoot) : refRoot
    return <div
        // @ts-ignore
        ref={rr}
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
            style={{
                padding: 6,
                border: '1px solid #333333',
                background: !isDragging && isOver ? '#e7e6e6' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                opacity: isDragging ? 0.4 : 1,
                flexGrow: 1,
                transition: 'opacity 0.25s ease-out, background 0.16s ease-in',
            }}
        >
            {/* @ts-expect-error react-dnd not react18 compat / not updated yet here */}
            <span ref={fullDrag ? undefined : drag} style={{cursor: 'grab', padding: 6, fontSize: '1.5rem', lineHeight: '1.5rem'}}>☰</span>
            <code style={{padding: '4px 8px', fontSize: '1rem'}}>{index + 1}.</code>
            <div style={{display: 'flex', flexDirection: 'column', marginLeft: 6}}>
                <span>{id}</span>
                {isFirst ? <small>isFirst</small> : null}{' '}
                {isLast ? <small>isLast</small> : null}
            </div>
        </div>
    </div>
}
